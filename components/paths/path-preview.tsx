import { ArrowRight } from "lucide-react";

import type { Path } from "@/lib/mock-data";
import { getTool } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PathPreviewProps {
  path: Path;
  className?: string;
}

export function PathPreview({ path, className }: PathPreviewProps) {
  const pathTools = path.toolIds.map(getTool);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4",
        className,
      )}
    >
      <p className="text-sm font-medium">{path.name}</p>
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {pathTools.map((tool, index) => (
          <div key={tool.id} className="flex items-center gap-2">
            <span className="flex shrink-0 items-center gap-2 rounded-md border border-border px-2 py-1">
              <span
                aria-hidden="true"
                className="flex size-5 items-center justify-center rounded bg-muted text-[9px] font-semibold text-muted-foreground"
              >
                {tool.monogram}
              </span>
              <span className="whitespace-nowrap text-xs font-medium">
                {tool.name}
              </span>
            </span>
            {index < pathTools.length - 1 ? (
              <ArrowRight
                className="size-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
