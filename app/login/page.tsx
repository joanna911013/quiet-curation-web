"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [dismissQueryError, setDismissQueryError] = useState(false);

  const queryError =
    searchParams.get("error_description") ||
    searchParams.get("error_code") ||
    searchParams.get("error") ||
    "";
  const displayError = error || (!dismissQueryError ? queryError : "");

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isActive) {
        return;
      }
      if (data?.user) {
        router.replace("/");
      }
    };

    void checkSession();

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleContinue = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDismissQueryError(true);
    setIsSending(true);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
