import type { Path, Tool } from "./types";

/**
 * Products are now persisted in Supabase (see `lib/supabase/products.ts`).
 * This module re-exports the data-access functions and keeps the pure helpers
 * that derive URLs and resolve path/tool metadata.
 */
export {
  createId,
  getAllProducts,
  getPathHref,
  getPathId,
  getProductById,
  getProductByParam,
  getProductHref,
  getProductIdFromParam,
  getProductsByUser,
  getProductsForPath,
  getProductsForPathAndStep,
  saveProduct,
  toProductSlug,
  type Product,
} from "./supabase/products";

/**
 * Processes (saaspath) are stored in Supabase (see `lib/supabase/saaspath.ts`).
 * A process is a named collection of products linked through the
 * `saaspath_products` join table, so products can be reused across processes.
 */
export {
  attachProductsToSaasPath,
  deleteSaasPath,
  detachProductFromSaasPath,
  getAllSaasPaths,
  getProductsForSaasPath,
  getSaasPathById,
  getSaasPathWithProducts,
  getSaasPathsByUser,
  saveSaasPath,
  toSaasPathSlug,
  updateSaasPath,
  type SaasPath,
  type SaasPathProduct,
  type SaasPathWithProducts,
} from "./supabase/saaspath";

/** Resolve the path definition for a product. */
export function getPathForProduct(product: { pathSlug: string }, allPaths: Path[]): Path | undefined {
  return allPaths.find((path) => path.slug === product.pathSlug);
}

/**
 * All processes (paths) that contain this product.
 * A product is attached to one step of its process, so this returns every
 * process whose step list includes the product's step id.
 */
export function getPathsForProduct(
  product: { stepId: string },
  allPaths: Path[],
): Path[] {
  return allPaths.filter((path) =>
    path.steps.some((step) => step.id === product.stepId),
  );
}

/**
 * Find the full tool definition by name across all paths.
 * Used to enrich a product with the tool's description, price, difficulty,
 * "best for" and website link.
 */
export function getToolByName(name: string, allPaths: Path[]): Tool | undefined {
  for (const path of allPaths) {
    for (const step of path.steps) {
      const tool = step.tools.find((entry) => entry.name === name);
      if (tool) return tool;
    }
  }
  return undefined;
}
