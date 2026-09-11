"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  ExternalLink,
  Layers,
  Package,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPathBySlug, paths } from "@/lib/paths";
import {
  getPathHref,
  getPathsForProduct,
  getProductByParam,
  type Product,
} from "@/lib/submissions";

type ProductViewProps = {
  productId: string;
};

export function ProductView({ productId }: ProductViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    getProductByParam(productId)
      .then((result) => {
        if (!active) return;
        setProduct(result);
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setProduct(null);
        setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  if (!loaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-sm">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
          Product not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-600">
          We couldn't find this product. It may have been removed or the link is
          incomplete.
        </p>
        <Link
          href="/submit-stack"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Create a product
        </Link>
      </div>
    );
  }

  const path = getPathBySlug(product.pathSlug);
  const productName = product.name || path?.name || "Untitled product";
  // Every process that includes this product's step.
  const productPaths = getPathsForProduct(product, paths);

  return (
    <div className="space-y-10">
      <Link
        href={getPathHref(product.pathSlug)}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to process
      </Link>

      <header className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white via-emerald-50/40 to-stone-50 p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                <Package className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Product
              </Badge>
              {path && <Badge>{path.category}</Badge>}
              <Badge variant="outline">
                {productPaths.length} process
                {productPaths.length === 1 ? "" : "es"}
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              {productName}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              {product.description ||
                path?.description ||
                "No description provided yet."}
            </p>

            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-emerald-800 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-900"
              >
                Visit product
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <dl className="grid shrink-0 gap-4 rounded-xl border border-stone-200 bg-white/70 p-5 sm:grid-cols-3 md:w-72 md:grid-cols-1">
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <Layers className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <dt className="sr-only">Process</dt>
              <dd className="truncate font-medium text-stone-900">
                {path?.name ?? "Unknown process"}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <Wallet className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <dt className="sr-only">Estimated cost</dt>
              <dd>{path?.estimatedCost ?? "—"}</dd>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <Clock3 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <dt className="sr-only">Estimated time</dt>
              <dd>{path?.estimatedTime ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Processes with this product
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {productName} appears in {productPaths.length} process
            {productPaths.length === 1 ? "" : "es"}.
          </p>
        </div>

        {productPaths.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {productPaths.map((entry) => {
              const step = entry.steps.find(
                (candidate) => candidate.id === product.stepId,
              );
              const stepNumber = step
                ? entry.steps.findIndex((candidate) => candidate.id === step.id) + 1
                : null;

              return (
                <li key={entry.slug}>
                  <Link
                    href={getPathHref(entry.slug)}
                    className="group flex h-full flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{entry.category}</Badge>
                      {stepNumber && (
                        <Badge variant="outline">Step {stepNumber}</Badge>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-stone-950 transition-colors group-hover:text-emerald-800">
                      {entry.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
                      {entry.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800">
                      Open process
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
            This product isn't linked to any process yet.
          </p>
        )}
      </section>
    </div>
  );
}
