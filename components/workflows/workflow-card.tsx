import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Workflow } from "@/lib/mock-data";
import { WorkflowChain } from "@/components/workflows/workflow-chain";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const stepCount = workflow.steps.length;
  const toolCount = new Set(workflow.steps.map((step) => step.tool.id)).size;

  return (
    <Card className="group flex flex-col transition-colors hover:border-foreground/20">
      <CardHeader className="gap-2">
        <h3 className="text-base font-semibold tracking-tight">
          {workflow.title}
        </h3>
        <p className="text-sm text-muted-foreground">{workflow.description}</p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <WorkflowChain steps={workflow.steps} />

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {stepCount} steps · {toolCount} tools · {workflow.pathCount} paths
          </p>
          <Link
            href={`/workflows/${workflow.id}`}
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore workflow
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
