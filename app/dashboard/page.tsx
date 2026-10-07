import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { MySubmissions } from "@/components/MySubmissions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  let displayName = "there";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Require authentication: send anonymous visitors to the login page and
    // bring them back here after a successful sign-in.
    if (!user) {
      redirect("/login?next=/dashboard");
    }

    displayName =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split("@")[0] ??
      "there";
  } catch (error) {
    // Re-throw Next.js redirect errors so navigation works as expected.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    // Supabase is not configured yet — fall back to a generic greeting.
  }

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Personal workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Manage your saved SaaS paths, review submitted stacks, and continue building workflows for your next goal.
          </p>
        </div>

        <Button asChild>
          <Link href="/submit-stack">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit Stack
          </Link>
        </Button>
      </section>

      <section>
        <MySubmissions />
      </section>
    </div>
  );
}
