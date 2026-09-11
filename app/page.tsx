import Link from "next/link";
import { ArrowRight, Route, Sparkles } from "lucide-react";

import { PathCard } from "@/components/PathCard";
import { Button } from "@/components/ui/button";
import { categories, getCategoryCount, paths } from "@/lib/paths";

export default function HomePage() {
  const featuredPaths = paths.slice(0, 6);

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white via-emerald-50/40 to-stone-50 px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Workflow-driven SaaS directory
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
            Find the right SaaS path for your next workflow.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600">
            Explore ready-made stacks for traffic, content, sales, automation, and launch.
            Don't browse tools. Follow the path.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 px-6">
              <Link href="/paths">
                Explore Paths
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6">
              <Link href="/submit-stack">Submit Stack</Link>
            </Button>
          </div>

          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-stone-200 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">Paths</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-950">{paths.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">Categories</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-950">{categories.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-500">Tools</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-950">
                {paths.reduce(
                  (total, path) =>
                    total + path.steps.reduce((sum, step) => sum + step.tools.length, 0),
                  0,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="explore-paths" className="scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Explore Paths
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Each path breaks a goal into clear steps and recommends SaaS tools for every stage.
            </p>
          </div>
          <Link
            href="/paths"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
          >
            View all {paths.length} paths
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {featuredPaths.map((path) => (
            <PathCard key={path.slug} path={path} />
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          Categories
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Browse paths by the outcome you want to achieve.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/paths?category=${encodeURIComponent(category)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800 hover:shadow-md"
            >
              {category}
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
                {getCategoryCount(category)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-900 p-8 text-white shadow-sm sm:p-12">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-700/40 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/20">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Built a workflow worth sharing?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80">
                Submit your SaaS stack and help others reach their next goal faster.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 bg-white px-6 text-emerald-900 hover:bg-emerald-50"
          >
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
