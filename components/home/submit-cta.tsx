import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SubmitCta() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card px-6 py-14 text-center">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Have a SaaS tool?
            </h2>
            <p className="max-w-md text-muted-foreground">
              Add your product to the workflows where it belongs.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/submit">Submit your tool</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
