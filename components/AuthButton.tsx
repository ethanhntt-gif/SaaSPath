"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/**
 * Header auth control.
 *
 * - When signed out, shows a "Sign In" button that links to /login.
 * - When signed in, shows the user's avatar/name and a "Sign Out" action.
 *
 * The component subscribes to Supabase auth state changes so the header updates
 * immediately after sign-in/sign-out without a full page reload.
 */
export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      // Supabase env vars are not configured yet — fall back to the sign-in link.
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        className="h-10 w-24 animate-pulse rounded-md bg-stone-200"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "Account";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-stone-700 transition-colors hover:text-emerald-800"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full border border-stone-200 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-800">
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <span className="hidden max-w-[10rem] truncate sm:inline">{name}</span>
      </Link>

      <form action="/auth/signout" method="post">
        <Button type="submit" variant="outline" aria-label="Sign out">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </form>
    </div>
  );
}
