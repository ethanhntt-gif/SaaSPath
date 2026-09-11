import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";

import { PathCard } from "@/components/PathCard";
import { Button } from "@/components/ui/button";
import { categories, getCategoryCount, paths } from "@/lib/paths";

export default function HomePage() {
  const featuredPaths = paths.slice(0, 6);

  return (
    <div className="space-y-12">
      <section className="flex flex-col gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Workflow-driven SaaS directory
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Find the right SaaS path for your next workflow.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Ready-made stacks for traffic, content, sales, automation, and launch.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button asChild>
            <Link href="/paths">
              Explore Paths
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/submit-stack">Submit Stack</Link>
          </Button>
        </div>
      </section>

      <section id="explore-paths" className="scroll-mt-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
              Explore Paths
            </h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Each path breaks a goal into clear steps and recommends SaaS tools for every stage.
            </p>
          </div>
          <Link
            href="/paths"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
          >
            View all {paths.length} paths
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {featuredPaths.map((path) => (
            <PathCard key={path.slug} path={path} />
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
          Categories
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          Browse paths by the outcome you want to achieve.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/paths?category=${encodeURIComponent(category)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800 hover:shadow-md"
            >
              {category}
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
                {getCategoryCount(category)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-900 p-6 text-white shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-700/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/20">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Built a workflow worth sharing?</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-emerald-50/80">
                Submit your SaaS stack and help others reach their next goal faster.
              </p>
            </div>
          </div>
          <Button asChild className="bg-white text-emerald-900 hover:bg-emerald-50">
            <Link href="/submit-stack">
              Submit Stack
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
