"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [dismissQueryError, setDismissQueryError] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  const queryError =
    searchParams.get("error_description") ||
    searchParams.get("error_code") ||
    searchParams.get("error") ||
    "";
  const displayError = formatAuthError(
    error || (!dismissQueryError ? queryError : ""),
    isInAppBrowser,
  );
  const safeRedirect = sanitizeRedirect(redirectParam);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isActive) {
        return;
      }
      if (data?.user) {
        router.replace(safeRedirect);
      }
    };

    void checkSession();

    return () => {
      isActive = false;
    };
  }, [router, safeRedirect]);

  useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }
    const ua = navigator.userAgent || "";
    const inApp =
      /KAKAOTALK|KakaoTalk|NAVER|Daum|FBAN|FBAV|Instagram|Line|Twitter|Snapchat/i.test(
        ua,
      );
    setIsInAppBrowser(inApp);
  }, []);

  const handleContinue = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDismissQueryError(true);
    setIsSending(true);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const callbackUrl = new URL("/auth/callback", baseUrl);
    callbackUrl.searchParams.set("redirect", safeRedirect);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });
    if (signInError) {
      setError(signInError.message || "Unable to send magic link.");
      setIsSending(false);
      return;
    }
    setLinkSent(true);
    setIsSending(false);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-16 pt-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-neutral-500">
            Receive a calm daily reading in your inbox.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-neutral-500">Email</span>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setLinkSent(false);
              setDismissQueryError(true);
            }}
            className="h-11 rounded-xl border border-neutral-200 bg-transparent px-4 text-base outline-none focus:border-neutral-400"
          />
        </label>

        <Button onClick={handleContinue} disabled={!email || isSending}>
          {linkSent ? "Link sent" : "Send magic link"}
        </Button>

        {displayError ? (
          <p className="text-xs text-rose-500">{displayError}</p>
        ) : isInAppBrowser ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            In-app browsers can block magic links. Open this page in Safari or
            Chrome, then request the link again.
          </div>
        ) : linkSent ? (
          <p className="text-xs text-neutral-400">
            Check your inbox for a sign-in link.
          </p>
        ) : (
          <p className="text-xs text-neutral-400">
            Enter an email to continue.
          </p>
        )}
      </div>
    </main>
  );
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

function formatAuthError(value: string, isInAppBrowser: boolean) {
  if (!value) {
    return "";
  }
  const lower = value.toLowerCase();
  if (lower.includes("pkce_code_verifier_not_found")) {
    return isInAppBrowser
      ? "This link must be opened in the same browser. Open in Safari/Chrome and request a new link."
      : "Please open the link in the same browser where you requested it.";
  }
  if (lower.includes("auth_failed") && isInAppBrowser) {
    return "Sign-in failed in the in-app browser. Open in Safari/Chrome and try again.";
  }
  return value;
}
