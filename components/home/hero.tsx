import { Search } from "lucide-react";

import { exampleGoals } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Find the right tools for the job.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
            Discover workflows built from the best SaaS tools.
          </p>

          <form
            className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-2 sm:flex-row"
            role="search"
            aria-label="Search workflows"
          >
            <label htmlFor="goal-search" className="sr-only">
              What do you want to accomplish?
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="goal-search"
                type="search"
                name="goal"
                placeholder="Create a YouTube video..."
                className="h-12 pl-9 text-base"
                autoComplete="off"
              />
            </div>
            <Button type="submit" size="lg" className="h-12">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {exampleGoals.map((goal) => (
              <button
                key={goal}
                type="button"
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
