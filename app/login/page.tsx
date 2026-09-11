import Link from "next/link";
import { redirect } from "next/navigation";
import { Route } from "lucide-react";

import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/dashboard";

  // If Supabase is configured and the user is already signed in, skip the form.
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(next);
    }
  } catch {
    // Supabase not configured yet — render the page so setup can be completed.
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10">
      <div className="w-full rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm">
            <Route className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
            Sign in to SaaSPath
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Save paths, submit stacks, and keep your workflows in one place.
          </p>
        </div>

        {params.error ? (
          <p
            className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            Sign-in failed. Please try again.
          </p>
        ) : null}

        <div className="mt-8">
          <GoogleSignInButton next={next} />
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-stone-500">
          By continuing you agree to our{" "}
          <Link href="/" className="underline hover:text-emerald-800">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline hover:text-emerald-800">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
