import { ArrowDown, Plus } from "lucide-react";

import { builderSteps } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function BuildYourOwnPath() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Build your own path
            </h2>
            <p className="max-w-md text-muted-foreground">
              Choose a goal and create your own workflow using the tools you
              already love.
            </p>
            <div>
              <Button variant="outline" asChild>
                <a href="/paths/new">Start building</a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-xs rounded-md border border-border bg-background px-4 py-3 text-center">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Goal
                </span>
                <p className="text-sm font-medium">Create a YouTube video</p>
              </div>

              <ArrowDown
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />

              {builderSteps.map((step, index) => (
                <div key={step} className="flex w-full flex-col items-center gap-2">
                  <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3">
                    <span className="text-sm font-medium">{step}</span>
                    <button
                      type="button"
                      aria-label={`Add tool to ${step} step`}
                      className="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  {index < builderSteps.length - 1 ? (
                    <ArrowDown
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
