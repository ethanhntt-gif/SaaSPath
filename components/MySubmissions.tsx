"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Package, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPathBySlug } from "@/lib/paths";
import { getPathHref, getProductHref, getProductsByUser, type Product } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";

type SubmissionGroup = {
  slug: string;
  name: string;
  category: string;
  products: Product[];
};

/**
 * Shows the signed-in user's own submissions, grouped by process (path).
 * Only the current user's products are fetched (filtered by user_id).
 */
export function MySubmissions() {
  const [groups, setGroups] = useState<SubmissionGroup[] | null>(null);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      setGroups([]);
      return;
    }

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!data.user) {
          if (active) setGroups([]);
          return null;
        }
        return getProductsByUser(data.user.id, supabase);
      })
      .then((products) => {
        if (!active || !products) return;

        const bySlug = new Map<string, SubmissionGroup>();
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

  if (!groups) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" aria-hidden="true" />
        <div className="mt-4 space-y-3">
          <div className="h-12 animate-pulse rounded bg-stone-100" aria-hidden="true" />
          <div className="h-12 animate-pulse rounded bg-stone-100" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">My submissions</h2>
            <p className="mt-1 text-sm text-stone-600">
              You haven't submitted any stacks yet.
            </p>
          </div>
          <Route className="h-5 w-5 text-emerald-800" aria-hidden="true" />
        </div>
        <Link
          href="/submit-stack"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
        >
          Submit your first stack
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const totalProducts = groups.reduce((sum, group) => sum + group.products.length, 0);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-950">My submissions</h2>
          <p className="mt-1 text-sm text-stone-600">
            Stacks you submitted, grouped by process.
          </p>
        </div>
        <Route className="h-5 w-5 text-emerald-800" aria-hidden="true" />
      </div>

      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <div key={group.slug}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{group.category}</Badge>
              <Link
                href={getPathHref(group.slug)}
                className="font-medium text-stone-950 transition-colors hover:text-emerald-800"
              >
                {group.name}
              </Link>
              <Badge variant="outline">
                <Layers className="mr-1 h-3 w-3" aria-hidden="true" />
                {group.products.length}
              </Badge>
            </div>

            <ul className="mt-3 space-y-2">
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
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-stone-100 pt-4 text-sm text-stone-500">
        {totalProducts} {totalProducts === 1 ? "submission" : "submissions"} total
      </p>
    </div>
  );
}
