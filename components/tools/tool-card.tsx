import type { Tool } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground"
      >
        {tool.monogram}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{tool.name}</p>
        <p className="truncate text-xs text-muted-foreground">{tool.tagline}</p>
      </div>
    </div>
  );
}

interface ToolCategoryCardProps {
  label: string;
  description: string;
  toolCount: number;
}

export function ToolCategoryCard({
  label,
  description,
  toolCount,
}: ToolCategoryCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <Badge variant="muted">{toolCount}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
