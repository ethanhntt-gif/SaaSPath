import { workflows } from "@/lib/mock-data";
import { WorkflowCard } from "@/components/workflows/workflow-card";

export function PopularWorkflows() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Popular workflows
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Start from a proven sequence of steps, then swap in the tools you
            prefer.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    </section>
  );
}
