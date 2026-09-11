import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";

import { PathCard } from "@/components/PathCard";
import { Button } from "@/components/ui/button";
import { categories, getCategoryCount, paths } from "@/lib/paths";

export default function HomePage() {
  const featuredPaths = paths.slice(0, 6);

  return (
    <div className="space-y-20">
      <section className="py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Workflow-driven SaaS directory
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
          Find the right SaaS path for your next workflow.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600">
          Explore ready-made stacks for traffic, content, sales, automation, and launch.
          Don't browse tools. Follow the path.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/paths?category=${encodeURIComponent(category)}`}
              className="group flex items-center justify-between rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-medium text-stone-950 transition-colors group-hover:text-emerald-800">
                  {category}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {getCategoryCount(category)} paths
                </p>
              </div>
              <ArrowRight
                className="h-4 w-4 text-stone-400 transition-colors group-hover:text-emerald-800"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-800 text-white">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-stone-950">
                Built a workflow worth sharing?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                Submit your SaaS stack and help others reach their next goal faster.
              </p>
            </div>
          </div>
          <Button asChild>
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
