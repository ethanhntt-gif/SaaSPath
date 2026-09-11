import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, ExternalLink, Layers, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPathBySlug, paths } from "@/lib/paths";

type PathDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return paths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: PathDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathBySlug(slug);

  if (!path) {
    return { title: "Path not found | SaaSPath" };
  }

  return {
    title: `${path.name} | SaaSPath`,
    description: path.description,
  };
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { slug } = await params;
  const path = getPathBySlug(slug);

  if (!path) {
    notFound();
  }

  const toolCount = path.steps.reduce((total, step) => total + step.tools.length, 0);

  return (
    <div className="space-y-10">
      <Link
        href="/paths"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-emerald-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All paths
      </Link>

      <header className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{path.category}</Badge>
          <Badge variant="outline">{path.difficulty}</Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          {path.name}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600">{path.description}</p>

        <dl className="mt-6 grid gap-4 border-t border-stone-200 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <Layers className="h-4 w-4 text-emerald-800" aria-hidden="true" />
            <dt className="sr-only">Steps</dt>
            <dd>{path.steps.length} steps</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <Wallet className="h-4 w-4 text-emerald-800" aria-hidden="true" />
            <dt className="sr-only">Estimated cost</dt>
            <dd>{path.estimatedCost}</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <Clock3 className="h-4 w-4 text-emerald-800" aria-hidden="true" />
            <dt className="sr-only">Estimated time</dt>
            <dd>{path.estimatedTime}</dd>
          </div>
        </dl>
      </header>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">The workflow</h2>
          <p className="text-sm text-stone-500">{toolCount} tools across {path.steps.length} steps</p>
        </div>

        <ol className="space-y-6">
          {path.steps.map((step, index) => (
            <li key={step.id}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-800 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-stone-950">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{step.description}</p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {step.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="rounded-md border border-stone-200 bg-stone-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-medium text-stone-950">{tool.name}</h4>
                            <Badge variant="muted">{tool.price}</Badge>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-stone-600">
                            {tool.description}
                          </p>
                          <p className="mt-3 text-xs text-stone-500">
                            Best for: {tool.bestFor} · {tool.difficulty}
                          </p>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
                          >
                            Visit site
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">Have a better stack for this goal?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Submit your own workflow and help others reach the same outcome.
            </p>
          </div>
          <Link
            href="/submit-stack"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-900"
          >
            Submit Stack
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
