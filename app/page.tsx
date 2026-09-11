import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";

import { CreatedProcesses } from "@/components/CreatedProcesses";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col gap-8 border-b border-stone-200 pb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            Workflow-driven SaaS directory
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Find the right SaaS path for your{" "}
            <span className="text-emerald-800">next workflow</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
            Ready-made stacks for{" "}
            <span className="font-semibold text-stone-900">traffic</span>,{" "}
            <span className="font-semibold text-stone-900">content</span>,{" "}
            <span className="font-semibold text-stone-900">sales</span>,{" "}
            <span className="font-semibold text-stone-900">automation</span>, and{" "}
            <span className="font-semibold text-stone-900">launch</span>.
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

      <CreatedProcesses />

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
