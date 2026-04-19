import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type"); // "signup" | "recovery"
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Password reset — send to the reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      // Email confirmation — send to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to auth with error
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}