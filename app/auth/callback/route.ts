import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 *
 * Supabase redirects the user here after a successful Google sign-in with a
 * `code` query parameter. We exchange that code for a session (stored in
 * cookies) and then redirect the user to the page they originally requested.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Only allow relative redirects to avoid open-redirect vulnerabilities.
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong — send the user back to the login page with an error.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
