import Link from "next/link";
import { ArrowRight, Clock3, Layers, Plus, Route, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const savedPaths = [
  {
    name: "Steps For SEO Traffic",
    tools: "ChatGPT -> Jasper -> Ghost",
    status: "Draft",
  },
  {
    name: "Steps For MVP Launch",
    tools: "Bolt.new -> Supabase -> Stripe -> Vercel",
    status: "Exploring",
  },
  {
    name: "Steps For Cold Outreach",
    tools: "Apollo -> Instantly -> HubSpot",
    status: "Saved",
  },
];

const stats = [
  { label: "Saved paths", value: "12" },
  { label: "Submitted stacks", value: "3" },
  { label: "Monthly stack cost", value: "$184" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Personal workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Welcome back, Ethan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Manage your saved SaaS paths, review submitted stacks, and continue building workflows for your next goal.
          </p>
        </div>

        <Button asChild>
          <Link href="/submit-stack">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit Stack
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-600">{item.label}</p>
            <strong className="mt-2 block text-3xl font-semibold text-stone-950">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-950">Saved Paths</h2>
              <p className="mt-1 text-sm text-stone-600">Workflows you are comparing or preparing to launch.</p>
            </div>
            <Route className="h-5 w-5 text-emerald-800" aria-hidden="true" />
          </div>

          <div className="mt-6 divide-y divide-stone-200">
            {savedPaths.map((path) => (
              <Link
                key={path.name}
                href="/"
                className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-emerald-800"
              >
                <div>
                  <h3 className="font-medium text-stone-950">{path.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">{path.tools}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                    {path.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone-400" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <Sparkles className="h-5 w-5 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-stone-950">Next recommendation</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Complete your SEO Traffic path by choosing a publishing tool and analytics step.
            </p>
          </article>

          <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <Clock3 className="h-5 w-5 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-stone-950">Recent activity</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Your last stack submission is pending review. Most reviews are completed within 48 hours.
            </p>
          </article>

          <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <Layers className="h-5 w-5 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-stone-950">Submitted stacks</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Track submitted SaaS chains and update descriptions before publishing.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
