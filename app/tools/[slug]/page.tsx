import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Route, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPathsForTool, getToolBySlug, getToolSlugs, toToolSlug } from "@/lib/paths";

type ToolDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getToolBySlug(slug);

  if (!entry) {
    return { title: "Tool not found | SaaSPath" };
  }

  return {
    title: `${entry.tool.name} | SaaSPath`,
    description: entry.tool.description,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const entry = getToolBySlug(slug);

  if (!entry) {
    notFound();
  }

  const { tool, path, step } = entry;
  const relatedPaths = getPathsForTool(tool.name);

  return (
    <div className="space-y-10">
      <Link
        href={`/paths/${path.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to {path.name}
      </Link>

      <header className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white via-emerald-50/40 to-stone-50 p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-emerald-800 text-xl font-semibold text-white shadow-sm">
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{tool.difficulty}</Badge>
                <Badge variant="outline">{tool.price}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {tool.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
                {tool.description}
              </p>
            </div>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-emerald-800 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-900"
          >
            Visit website
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">Where it fits</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              This tool is used in the <strong>{step.title}</strong> step of the{" "}
              <Link
                href={`/paths/${path.slug}`}
                className="font-medium text-emerald-800 hover:text-emerald-900"
              >
                {path.name}
              </Link>{" "}
              workflow.
            </p>

            <dl className="mt-5 grid gap-4 border-t border-stone-200 pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">Best for</dt>
                <dd className="mt-1 text-sm text-stone-800">{tool.bestFor}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">Pricing</dt>
                <dd className="mt-1 text-sm text-stone-800">{tool.price}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">Difficulty</dt>
                <dd className="mt-1 text-sm text-stone-800">{tool.difficulty}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">Step</dt>
                <dd className="mt-1 text-sm text-stone-800">{step.title}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">Step description</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Appears in
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {relatedPaths.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/paths/${related.slug}`}
                    className="group flex items-center justify-between gap-3 text-sm font-medium text-stone-800 transition-colors hover:text-emerald-800"
                  >
                    <span className="min-w-0 truncate">{related.name}</span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-stone-400 transition-colors group-hover:text-emerald-800"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Path budget
              </h2>
            </div>
            <p className="mt-3 text-sm text-stone-600">
              The full {path.name} workflow costs around{" "}
              <strong className="text-stone-900">{path.estimatedCost}</strong>.
            </p>
          </article>
        </aside>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-950">Other tools in this step</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {step.tools
            .filter((item) => item.name !== tool.name)
            .map((item) => (
              <Link
                key={item.name}
                href={`/tools/${toToolSlug(item.name)}`}
                className="group inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50/70 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-white"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-stone-900">{item.name}</span>
                  <span className="block text-xs text-stone-500">{item.bestFor}</span>
                </span>
              </Link>
            ))}
          {step.tools.filter((item) => item.name !== tool.name).length === 0 && (
            <p className="text-sm text-stone-500">This is the only tool in this step.</p>
          )}
        </div>
      </section>
    </div>
  );
}
