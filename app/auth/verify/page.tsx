"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isActive = true;

    const redirectWithError = (error: {
      code?: string | null;
      message?: string | null;
      fallback?: string;
    }) => {
      const params = new URLSearchParams();
      params.set("error", error.fallback ?? "auth_failed");
      if (error.code) {
        params.set("error_code", error.code);
      }
      if (error.message) {
        params.set("error_description", error.message);
      }
      router.replace(`/login?${params.toString()}`);
    };

    const verify = async () => {
      const code = searchParams.get("code");
      const tokenHash =
        searchParams.get("token_hash") ?? searchParams.get("token");
      const otpType = searchParams.get("type");
      const errorParam = searchParams.get("error");
      const errorCode = searchParams.get("error_code");
      const errorDescription = searchParams.get("error_description");

      if (errorParam || errorCode || errorDescription) {
        redirectWithError({
          code: errorCode ?? errorParam,
          message: errorDescription,
          fallback: errorParam ?? "auth_failed",
        });
        return;
      }

      if (!code && !(tokenHash && otpType)) {
        redirectWithError({ fallback: "missing_code" });
        return;
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
        if (!isActive) {
          return;
        }
        if (error) {
          redirectWithError({ code: error.code, message: error.message });
          return;
        }
        router.replace("/");
        return;
      }

      const { error: initError } = await supabase.auth.initialize();
      if (!isActive) {
        return;
      }
      if (initError) {
        redirectWithError({
          code: initError.code,
          message: initError.message,
        });
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!isActive) {
        return;
      }
      if (data?.session) {
        router.replace("/");
        return;
      }

      redirectWithError({ fallback: "auth_failed" });
    };

    void verify();

    return () => {
      isActive = false;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-5 pb-16 pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Quiet Curation
        </p>
        <p className="text-sm text-neutral-500">Signing you in...</p>
      </div>
    </main>
  );
}
