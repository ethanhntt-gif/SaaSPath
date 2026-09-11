import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "./client";

/**
 * A user-created product attached to a process (path) and one of its steps.
 *
 * Stored in the Supabase `products` table. Products are publicly readable so
 * every created process shows up for all visitors, while writes are restricted
 * to the authenticated owner via Row Level Security.
 */
export interface Product {
  id: string;
  /** Owner of the product (auth.users.id). */
  userId: string;
  /** Slug of the process (path) this product belongs to. */
  pathSlug: string;
  /** Catalog name of the process, e.g. "Steps For Organic Video Content Factory". */
  pathName: string;
  /** Id of the step this product belongs to. */
  stepId: string;
  name: string;
  /** URL-safe slug generated from the product name. */
  slug: string;
  url: string;
  description: string;
  /** One selected tool per step id. */
  selectedTools: Record<string, string>;
  createdAt: string;
}

/** Shape of a row in the `products` table. */
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

function mapRow(row: ProductRow): Product {
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

/**
 * Build a URL-safe slug from a product name.
 *
 * Lowercases the name, replaces any run of non-alphanumeric characters with a
 * single dash, and trims leading/trailing dashes. Falls back to "product" when
 * the name has no usable characters.
 */
export function toProductSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "product";
}

/** Generate a short, URL-safe unique id. */
export function createId(): string {
  const random = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `${time}${random}`;
}

/**
 * Stable id for a process (path). Derived from the slug so the same process
 * always maps to the same /paths/<slug>-<pathId> address.
 */
export function getPathId(pathSlug: string): string {
  let hash = 0;
  for (let i = 0; i < pathSlug.length; i += 1) {
    hash = (hash * 31 + pathSlug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

/** Build the process page URL: /paths/<slug>-<pathId>. */
export function getPathHref(pathSlug: string): string {
  return `/paths/${pathSlug}-${getPathId(pathSlug)}`;
}

/**
 * Build the product page URL: /products/<slug>-<productId>.
 *
 * The slug is generated from the product name for readability, while the id
 * keeps the URL unique and stable. When no slug is available the id alone is
 * used so old links keep working.
 */
export function getProductHref(productId: string, slug?: string): string {
  return slug ? `/products/${slug}-${productId}` : `/products/${productId}`;
}

/**
 * Extract the product id from a /products/<slug>-<productId> URL segment.
 * Falls back to the whole segment when it has no slug prefix.
 */
export function getProductIdFromParam(param: string): string {
  const separator = param.lastIndexOf("-");
  return separator === -1 ? param : param.slice(separator + 1);
}

function getClient(client?: SupabaseClient): SupabaseClient {
  return client ?? createClient();
}

/** Every created product, newest first. Publicly readable. */
export async function getAllProducts(client?: SupabaseClient): Promise<Product[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

/** All products attached to a given process, newest first. */
export async function getProductsForPath(
  pathSlug: string,
  client?: SupabaseClient,
): Promise<Product[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("saaspath_slug", pathSlug)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

/**
 * Products attached to a specific step of a process, newest first.
 *
 * Used by the submission form so each step offers the products that were
 * actually created for that process and step, instead of a static tool list.
 */
export async function getProductsForPathAndStep(
  pathSlug: string,
  stepId: string,
  client?: SupabaseClient,
): Promise<Product[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("saaspath_slug", pathSlug)
    .eq("step_id", stepId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

/** Products created by a specific user, newest first. */
export async function getProductsByUser(
  userId: string,
  client?: SupabaseClient,
): Promise<Product[]> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

/** A single product by id, or null when it does not exist. */
export async function getProductById(
  id: string,
  client?: SupabaseClient,
): Promise<Product | null> {
  const supabase = getClient(client);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as ProductRow) : null;
}

/**
 * A single product by its /products/<slug>-<productId> URL segment.
 * The id is extracted from the end of the segment, so links keep working even
 * when the slug part changes.
 */
export async function getProductByParam(
  param: string,
  client?: SupabaseClient,
): Promise<Product | null> {
  return getProductById(getProductIdFromParam(param), client);
}

/**
 * Persist a new product for the currently signed-in user and return it.
 *
 * Throws when the user is not authenticated — the caller should redirect to
 * the login page in that case.
 */
export async function saveProduct(
  input: {
    pathSlug: string;
    /** Catalog name of the process, stored so the saaspath trigger can use it. */
    pathName?: string;
    stepId: string;
    name: string;
    url: string;
    description: string;
    selectedTools: Record<string, string>;
  },
  client?: SupabaseClient,
): Promise<Product> {
  const supabase = getClient(client);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  const row = {
    product_id: createId(),
    user_id: user.id,
    saaspath_slug: input.pathSlug,
    saaspath_name: input.pathName ?? "",
    step_id: input.stepId,
    name: input.name,
    product_slug: toProductSlug(input.name),
    url: input.url,
    description: input.description,
    selected_tools: input.selectedTools,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data as ProductRow);
}
