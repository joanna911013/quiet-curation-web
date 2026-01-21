import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash =
    url.searchParams.get("token_hash") ?? url.searchParams.get("token");
  const otpType = url.searchParams.get("type");
  const redirectParam = url.searchParams.get("redirect");
  const errorParam = url.searchParams.get("error");
  const errorCode = url.searchParams.get("error_code");
  const errorDescription = url.searchParams.get("error_description");
  const origin = url.origin;
  const safeRedirect = sanitizeRedirect(redirectParam);

  if (errorParam || errorCode || errorDescription) {
    const params = new URLSearchParams();
    if (errorCode) {
      params.set("error_code", errorCode);
    }
    if (errorDescription) {
      params.set("error_description", errorDescription);
    }
    if (!errorCode && !errorDescription && errorParam) {
      params.set("error", errorParam);
    }
    appendRedirectParam(params, safeRedirect);
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  if (!code && !(tokenHash && otpType)) {
    const params = new URLSearchParams();
    params.set("error", "missing_code");
    appendRedirectParam(params, safeRedirect);
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  const response = NextResponse.redirect(`${origin}${safeRedirect}`);
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  let authError: { message?: string; code?: string } | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
  }

  if (authError && tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as
        | "magiclink"
        | "signup"
        | "recovery"
        | "invite"
        | "email"
        | "email_change",
    });
    authError = error;
  }

  if (!code && tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType as
        | "magiclink"
        | "signup"
        | "recovery"
        | "invite"
        | "email"
        | "email_change",
    });
    authError = error;
  }

  if (authError) {
    if (authError.code === "pkce_code_verifier_not_found" && code) {
      const params = new URLSearchParams();
      params.set("code", code);
      if (otpType) {
        params.set("type", otpType);
      }
      if (tokenHash) {
        params.set("token_hash", tokenHash);
      }
      appendRedirectParam(params, safeRedirect);
      return NextResponse.redirect(`${origin}/auth/verify?${params.toString()}`);
    }
    const params = new URLSearchParams();
    params.set("error", "auth_failed");
    if (authError.code) {
      params.set("error_code", authError.code);
    }
    if (authError.message) {
      params.set("error_description", authError.message);
    }
    appendRedirectParam(params, safeRedirect);
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  return response;
}

function sanitizeRedirect(value: string | null) {
  if (!value) {
    return "/";
  }
  if (!value.startsWith("/")) {
    return "/";
  }
  if (value.startsWith("//")) {
    return "/";
  }
  if (value.toLowerCase().includes("http")) {
    return "/";
  }
  return value;
}

function appendRedirectParam(params: URLSearchParams, redirectPath: string) {
  if (redirectPath && redirectPath !== "/") {
    params.set("redirect", redirectPath);
  }
}
