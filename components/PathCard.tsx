import Link from "next/link";
import { ArrowRight, Clock3, Layers, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

  return (
    <Link
      href={`/paths/${path.slug}`}
      className="group flex flex-col gap-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-stone-950 transition-colors group-hover:text-emerald-800">
            {path.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{path.tagline}</p>
        </div>

        <dl className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-600 sm:flex-col sm:items-end sm:gap-y-2.5">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <dt className="sr-only">Steps</dt>
            <dd>{path.steps.length} steps</dd>
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

      <ol className="flex flex-row items-stretch gap-2 overflow-x-auto border-t border-stone-100 pt-6 pb-1">
        {chain.map((tool, index) => (
          <li key={`${tool.name}-${index}`} className="flex shrink-0 items-center gap-2">
            {index > 0 && (
              <ArrowRight className="h-5 w-5 shrink-0 text-stone-300" aria-hidden="true" />
            )}
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3">
              <span
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-semibold ring-2 ring-white ${
                  avatarPalette[index % avatarPalette.length]
                }`}
                aria-hidden="true"
              >
                {getInitials(tool.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-stone-900">{tool.name}</p>
                <p className="truncate text-sm text-stone-500">{tool.bestFor}</p>
              </div>
            </div>
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
    </Link>
  );
}
