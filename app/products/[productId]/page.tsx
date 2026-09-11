import type { Metadata } from "next";

import { ProductView } from "@/components/ProductView";
import { getProductIdFromParam } from "@/lib/supabase/products";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const id = getProductIdFromParam(productId);

  return {
    title: `Product ${id} | SaaSPath`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  return <ProductView productId={productId} />;
}
