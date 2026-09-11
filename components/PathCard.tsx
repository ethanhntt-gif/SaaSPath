import Link from "next/link";
import { ArrowRight, Clock3, Layers, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Path } from "@/lib/types";

type PathCardProps = {
  path: Path;
};

export function PathCard({ path }: PathCardProps) {
  const toolCount = path.steps.reduce((total, step) => total + step.tools.length, 0);

  return (
    <Link
      href={`/paths/${path.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{path.category}</Badge>
          <Badge variant="outline">{path.difficulty}</Badge>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-stone-950 transition-colors group-hover:text-emerald-800">
            {path.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{path.tagline}</p>
        </div>
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

      <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500 transition-colors group-hover:bg-emerald-800 group-hover:text-white sm:grid">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
