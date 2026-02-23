"use client";

import { type FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setIsSending(true);
    trackEvent("sub_cta_request_click");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const callbackUrl = new URL("/auth/callback", baseUrl);
    callbackUrl.searchParams.set("redirect", "/today");

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    setIsSending(false);

    if (signInError) {
      setError(signInError.message || "Unable to send magic link.");
      setLinkSent(false);
      trackEvent("sub_cta_request_error");
      return;
    }

    setLinkSent(true);
    trackEvent("sub_cta_request_sent");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5"
    >
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--md-sys-color-on-surface-variant)]">Email</span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(inputEvent) => {
            setEmail(inputEvent.target.value);
            setError("");
            setLinkSent(false);
          }}
          className="h-11 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-white/70 px-4 text-base outline-none focus:border-[var(--md-sys-color-primary)]"
        />
      </label>

      <button
        type="submit"
        disabled={!email || isSending}
        className="mt-4 inline-flex w-fit items-center rounded-[20px] bg-[var(--md-sys-color-primary)] px-5 py-2 text-sm font-medium text-[var(--md-sys-color-on-primary)] min-h-[44px] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSending ? "Sending..." : linkSent ? "Link sent" : "Request invite"}
      </button>

      {error ? (
        <p className="mt-3 text-xs text-rose-600">{error}</p>
      ) : linkSent ? (
        <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          Check your inbox and confirm via the magic link to start receiving invites.
        </p>
      ) : (
        <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          We only send one calm pairing each weekday. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
