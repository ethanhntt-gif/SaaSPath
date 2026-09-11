import type { Metadata } from "next";
import Link from "next/link";

import { PathCard } from "@/components/PathCard";
import { categories, paths } from "@/lib/paths";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Explore Paths | SaaSPath",
  description: "Browse workflow-driven SaaS paths by goal and category.",
};

type PathsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

function isCategory(value: string): value is Category {
  return (categories as string[]).includes(value);
}

export default async function PathsPage({ searchParams }: PathsPageProps) {
  const { category } = await searchParams;
  const activeCategory = category && isCategory(category) ? category : undefined;

  const visiblePaths = activeCategory
    ? paths.filter((path) => path.category === activeCategory)
    : paths;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Explore Paths
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Workflow-driven SaaS stacks
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Pick a goal, follow the steps, and compare tools for every stage of the workflow.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        <Link
          href="/paths"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "border-emerald-800 bg-emerald-800 text-white"
              : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800",
          )}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            href={`/paths?category=${encodeURIComponent(item)}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              activeCategory === item
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800",
            )}
          >
            {item}
          </Link>
        ))}
      </nav>

      {visiblePaths.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePaths.map((path) => (
            <PathCard key={path.slug} path={path} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-stone-200 bg-white p-8 text-center text-sm text-stone-600">
          No paths found in this category yet.
        </p>
      )}
    </div>
  );
}
