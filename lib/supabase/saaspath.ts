import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "./client";
import { createId, toProductSlug, type Product } from "./products";

/**
 * A process (workflow) built from products.
 *
 * Stored in the Supabase `saaspath` table. A process is a named collection of
 * products; the products themselves live in `public.products` and are linked
 * through `public.saaspath_products`, so the same product can be reused across
 * several processes.
 *
 * Processes are publicly readable, while writes are restricted to the
 * authenticated owner via Row Level Security.
 */
export interface SaasPath {
  id: string;
  /** Owner of the process (auth.users.id). */
  userId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/** A product attached to a process, with its position inside the process. */
export interface SaasPathProduct {
  product: Product;
  /** Zero-based position of the product inside the process. */
  stepOrder: number;
}

/** A process together with its ordered products. */
export interface SaasPathWithProducts extends SaasPath {
  products: SaasPathProduct[];
}

/** Shape of a row in the `saaspath` table. */
interface SaasPathRow {
  saaspath_id: string;
  user_id: string;
  name: string;
  saaspath_slug: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

/** Shape of a row in the `saaspath_products` table. */
interface SaasPathProductRow {
  saaspath_id: string;
  product_id: string;
  step_order: number;
  created_at: string;
}

/** Shape of a product row joined through `saaspath_products`. */
interface JoinedProductRow {
  step_order: number;
  products: ProductRow | ProductRow[] | null;
}

/** Shape of a row in the `products` table (mirrors lib/supabase/products.ts). */
interface ProductRow {
  product_id: string;
  user_id: string;
  saaspath_slug: string;
  saaspath_name: string | null;
  step_id: string;
  name: string;
  product_slug: string | null;
  url: string;
  description: string;
  selected_tools: Record<string, string> | null;
  created_at: string;
}

function mapRow(row: SaasPathRow): SaasPath {
  return {
    id: row.saaspath_id,
    userId: row.user_id,
    name: row.name,
    slug: row.saaspath_slug,
    description: row.description,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.product_id,
    userId: row.user_id,
    pathSlug: row.saaspath_slug,
    pathName: row.saaspath_name ?? "",
    stepId: row.step_id,
    name: row.name,
    slug: row.product_slug ?? toProductSlug(row.name),
    url: row.url,
    description: row.description,
    selectedTools: row.selected_tools ?? {},
    createdAt: row.created_at,
  };
}

function getClient(client?: SupabaseClient): SupabaseClient {
  return client ?? createClient();
}

/**
 * Normalise the `saaspath_products` join result into ordered products.
 *
 * Supabase may return the embedded `products` relation as an object or as an
 * array depending on how the relationship is detected, so both are handled.
 */
function mapJoinedProducts(data: unknown): SaasPathProduct[] {
  const rows = (data ?? []) as JoinedProductRow[];

  return rows
    .map((row) => {
      const embedded = Array.isArray(row.products)
        ? row.products[0] ?? null
        : row.products;
      if (!embedded) return null;
      return {
        product: mapProductRow(embedded),
        stepOrder: row.step_order,
      } satisfies SaasPathProduct;
    })
    .filter((entry): entry is SaasPathProduct => entry !== null);
}

/** Turn a process name into a URL-safe slug. */
export function toSaasPathSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every process, newest first. Publicly readable. */
export async function getAllSaasPaths(client?: SupabaseClient): Promise<SaasPath[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("saaspath")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SaasPathRow[]).map(mapRow);
}

/** Processes created by a specific user, newest first. */
export async function getSaasPathsByUser(
  userId: string,
  client?: SupabaseClient,
): Promise<SaasPath[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("saaspath")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SaasPathRow[]).map(mapRow);
}

/** A single process by id, or null when it does not exist. */
export async function getSaasPathById(
  id: string,
  client?: SupabaseClient,
): Promise<SaasPath | null> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("saaspath")
    .select("*")
    .eq("saaspath_id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as SaasPathRow) : null;
}

/**
 * A process together with its ordered products.
 *
 * Products are fetched through the `saaspath_products` join table and sorted by
 * `step_order`, so the process renders in the order the owner defined.
 */
export async function getSaasPathWithProducts(
  id: string,
  client?: SupabaseClient,
): Promise<SaasPathWithProducts | null> {
  const supabase = getClient(client);

  const process = await getSaasPathById(id, supabase);
  if (!process) return null;

  const { data, error } = await supabase
    .from("saaspath_products")
    .select("step_order, products (*)")
    .eq("saaspath_id", id)
    .order("step_order", { ascending: true });

  if (error) throw error;

  const products = mapJoinedProducts(data);

  return { ...process, products };
}

/** Products attached to a process, ordered by their step position. */
export async function getProductsForSaasPath(
  id: string,
  client?: SupabaseClient,
): Promise<SaasPathProduct[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("saaspath_products")
    .select("step_order, products (*)")
    .eq("saaspath_id", id)
    .order("step_order", { ascending: true });

  if (error) throw error;

  return mapJoinedProducts(data);
}

/**
 * Create a process for the currently signed-in user and attach products to it.
 *
 * `productIds` are stored in the given order (index becomes `step_order`).
 * Throws `AUTH_REQUIRED` when the user is not authenticated — the caller should
 * redirect to the login page in that case.
 */
export async function saveSaasPath(
  input: {
    name: string;
    description?: string;
    category?: string;
    slug?: string;
    productIds?: string[];
  },
  client?: SupabaseClient,
): Promise<SaasPathWithProducts> {
  const supabase = getClient(client);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  const id = createId();
  const row = {
    saaspath_id: id,
    user_id: user.id,
    name: input.name,
    saaspath_slug: input.slug?.trim() || toSaasPathSlug(input.name),
    description: input.description ?? "",
    category: input.category ?? "",
  };

  const { data, error } = await supabase
    .from("saaspath")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;

  const process = mapRow(data as SaasPathRow);
  const productIds = input.productIds ?? [];

  if (productIds.length > 0) {
    await attachProductsToSaasPath(id, productIds, supabase);
  }

  return { ...process, products: await getProductsForSaasPath(id, supabase) };
}

/**
 * Attach products to a process, replacing the current set.
 *
 * The order of `productIds` defines `step_order`. Existing links are removed
 * first so the process always reflects the provided list.
 */
export async function attachProductsToSaasPath(
  saasPathId: string,
  productIds: string[],
  client?: SupabaseClient,
): Promise<void> {
  const supabase = getClient(client);

  const { error: deleteError } = await supabase
    .from("saaspath_products")
    .delete()
    .eq("saaspath_id", saasPathId);

  if (deleteError) throw deleteError;

  if (productIds.length === 0) return;

  const rows: SaasPathProductRow[] = productIds.map((productId, index) => ({
    saaspath_id: saasPathId,
    product_id: productId,
    step_order: index,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from("saaspath_products")
    .insert(rows);

  if (insertError) throw insertError;
}

/** Detach a single product from a process. */
export async function detachProductFromSaasPath(
  saasPathId: string,
  productId: string,
  client?: SupabaseClient,
): Promise<void> {
  const supabase = getClient(client);
  const { error } = await supabase
    .from("saaspath_products")
    .delete()
    .eq("saaspath_id", saasPathId)
    .eq("product_id", productId);

  if (error) throw error;
}

/** Update a process owned by the current user. */
export async function updateSaasPath(
  id: string,
  input: {
    name?: string;
    description?: string;
    category?: string;
    slug?: string;
  },
  client?: SupabaseClient,
): Promise<SaasPath> {
  const supabase = getClient(client);

  const patch: Record<string, string> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.description !== undefined) patch.description = input.description;
  if (input.category !== undefined) patch.category = input.category;
  if (input.slug !== undefined) patch.saaspath_slug = input.slug;

  const { data, error } = await supabase
    .from("saaspath")
    .update(patch)
    .eq("saaspath_id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data as SaasPathRow);
}

/** Delete a process owned by the current user (links cascade automatically). */
export async function deleteSaasPath(
  id: string,
  client?: SupabaseClient,
): Promise<void> {
  const supabase = getClient(client);
  const { error } = await supabase.from("saaspath").delete().eq("saaspath_id", id);

  if (error) throw error;
}
