import type { WorkflowStep as WorkflowStepType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  step: WorkflowStepType;
  className?: string;
}

export function WorkflowStep({ step, className }: WorkflowStepProps) {
  return (
    <div
      className={cn(
        "flex w-32 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {step.name}
      </span>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground"
        >
          {step.tool.monogram}
        </span>
        <span className="truncate text-sm font-medium">{step.tool.name}</span>
      </div>
    </div>
  );
}
