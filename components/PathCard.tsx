import Link from "next/link";
import { ArrowRight, Clock3, Layers, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { toToolSlug } from "@/lib/paths";
import { getPathHref } from "@/lib/submissions";
import type { Path } from "@/lib/types";

type PathCardProps = {
  path: Path;
};

const avatarPalette = [
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-800",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
  "bg-teal-100 text-teal-800",
];

function getInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function PathCard({ path }: PathCardProps) {
  const toolCount = path.steps.reduce((total, step) => total + step.tools.length, 0);

  // One representative tool per step, so the row shows the actual chain.
  const chain = path.steps.map((step) => step.tools[0]).filter(Boolean);
  const stepCount = chain.length;

  return (
    <div className="group relative flex flex-col gap-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-stone-950 transition-colors group-hover:text-emerald-800">
            <Link href={getPathHref(path.slug)} className="after:absolute after:inset-0">
              {path.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{path.tagline}</p>
        </div>

        <dl className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-600 sm:flex-col sm:items-end sm:gap-y-2.5">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <dt className="sr-only">Steps</dt>
            <dd>
              {stepCount} {stepCount === 1 ? "step" : "steps"}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <dt className="sr-only">Estimated cost</dt>
            <dd>{path.estimatedCost}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <dt className="sr-only">Tools</dt>
            <dd>{toolCount} tools</dd>
          </div>
        </dl>
      </div>

      <ol className="relative z-10 flex flex-row items-stretch gap-1.5 border-t border-stone-100 pt-6 pb-1">
        {chain.map((tool, index) => (
          <li
            key={`${tool.name}-${index}`}
            className="flex min-w-0 flex-1 items-center gap-1.5"
          >
            {index > 0 && (
              <ArrowRight className="h-4 w-4 shrink-0 text-stone-300" aria-hidden="true" />
            )}
            <Link
              href={`/tools/${toToolSlug(tool.name)}`}
              title={`${tool.name} — ${tool.bestFor}`}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/70 px-2.5 py-2 transition-colors hover:border-emerald-300 hover:bg-white"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ring-2 ring-white ${
                  avatarPalette[index % avatarPalette.length]
                }`}
                aria-hidden="true"
              >
                {getInitials(tool.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-stone-900">
                  {tool.name}
                </span>
                <span className="block truncate text-xs text-stone-500">{tool.bestFor}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
        <Badge>{path.category}</Badge>
        <Badge variant="outline">{path.difficulty}</Badge>
        <span className="ml-auto hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-emerald-800 group-hover:text-white sm:grid">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
