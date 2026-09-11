import Link from "next/link";
import { ArrowRight, Clock3, Layers, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Path } from "@/lib/types";

type PathCardProps = {
  path: Path;
};

export function PathCard({ path }: PathCardProps) {
  const toolCount = path.steps.reduce((total, step) => total + step.tools.length, 0);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <Badge>{path.category}</Badge>
          <Badge variant="outline">{path.difficulty}</Badge>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-stone-950">
          <Link href={`/paths/${path.slug}`} className="transition-colors hover:text-emerald-800">
            {path.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{path.tagline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-stone-200 pt-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
            <span>{path.steps.length} steps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
            <span>{path.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />
            <span>{toolCount} tools</span>
          </div>
        </dl>
      </div>

      <div className="border-t border-stone-200 px-6 py-4">
        <Link
          href={`/paths/${path.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-900"
        >
          View path
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
