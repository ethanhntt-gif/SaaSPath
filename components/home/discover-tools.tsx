import { workflowCategories, getToolsForCategory } from "@/lib/mock-data";
import { ToolCategoryCard } from "@/components/tools/tool-card";

export function DiscoverTools() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Discover tools by workflow step
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Every step has a category. Browse the tools that fit where you are
            in the workflow.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowCategories.map((category) => (
            <ToolCategoryCard
              key={category.id}
              label={category.label}
              description={category.description}
              toolCount={getToolsForCategory(category.label).length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
