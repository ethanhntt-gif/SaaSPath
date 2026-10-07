import { ArrowRight } from "lucide-react";

import type { WorkflowStep as WorkflowStepType } from "@/lib/mock-data";
import { WorkflowStep } from "@/components/workflows/workflow-step";
import { cn } from "@/lib/utils";

interface WorkflowChainProps {
  steps: WorkflowStepType[];
  className?: string;
}

export function WorkflowChain({ steps, className }: WorkflowChainProps) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-1 flex items-stretch gap-2 overflow-x-auto px-1 pb-1",
        className,
      )}
      role="list"
      aria-label="Workflow steps"
    >
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2" role="listitem">
          <WorkflowStep step={step} />
          {index < steps.length - 1 ? (
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
