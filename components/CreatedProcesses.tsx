"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Package, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPathBySlug } from "@/lib/paths";
import {
  getAllProducts,
  getPathHref,
  getProductHref,
  type Product,
} from "@/lib/submissions";

type ProcessGroup = {
  slug: string;
  name: string;
  category: string;
  description: string;
  products: Product[];
};

/**
 * Lists every process that has at least one product created through the
 * submission form. Products are stored in Supabase and are publicly readable,
 * so every visitor sees the processes created by all users.
 */
export function CreatedProcesses() {
  const [groups, setGroups] = useState<ProcessGroup[] | null>(null);

  useEffect(() => {
    let active = true;

    getAllProducts()
      .then((products) => {
        if (!active) return;

        const bySlug = new Map<string, ProcessGroup>();

        for (const product of products) {
          const path = getPathBySlug(product.pathSlug);
          const existing = bySlug.get(product.pathSlug);
          if (existing) {
            existing.products.push(product);
            continue;
          }
          bySlug.set(product.pathSlug, {
            slug: product.pathSlug,
            name: path?.name ?? product.pathSlug,
            category: path?.category ?? "Other",
            description: path?.description ?? "",
            products: [product],
          });
        }

        setGroups(Array.from(bySlug.values()));
      })
      .catch(() => {
        if (active) setGroups([]);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Created processes
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Processes built through the submission form, with the products attached
            to them.
          </p>
        </div>
        <p className="text-sm text-stone-500">
          {groups.length} {groups.length === 1 ? "process" : "processes"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.slug}
            className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                <Route className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{group.category}</Badge>
                  <Badge variant="outline">
                    <Layers className="mr-1 h-3 w-3" aria-hidden="true" />
                    {group.products.length}{" "}
                    {group.products.length === 1 ? "product" : "products"}
                  </Badge>
                </div>
                <h3 className="mt-2 font-semibold text-stone-950">
                  <Link
                    href={getPathHref(group.slug)}
                    className="transition-colors hover:text-emerald-800"
                  >
                    {group.name}
                  </Link>
                </h3>
                {group.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            <ul className="mt-4 space-y-2 border-t border-stone-100 pt-4">
              {group.products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={getProductHref(product.id, product.slug)}
                    className="group flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/70 px-3 py-2 transition-colors hover:border-emerald-300 hover:bg-white"
                  >
                    <Package
                      className="h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-900 transition-colors group-hover:text-emerald-800">
                      {product.name || "Untitled product"}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={getPathHref(group.slug)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
            >
              Open process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
