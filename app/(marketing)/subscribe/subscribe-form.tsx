"use client";

import { type FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

type SubscribeFormProps = {
  locale?: "en" | "ko";
};

const subscribeFormCopy = {
  en: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    sending: "Sending...",
    sent: "Link sent",
    requestInvite: "Request invite",
    invalidEmail: "Enter a valid email address.",
    sendError: "Unable to send magic link.",
    sentDescription:
      "Check your inbox and confirm via the magic link to start receiving invites.",
    idleDescription:
      "We only send one calm pairing each weekday. Unsubscribe anytime.",
  },
  ko: {
    email: "이메일",
    emailPlaceholder: "you@example.com",
    sending: "전송 중...",
    sent: "링크 전송 완료",
    requestInvite: "초대 요청하기",
    invalidEmail: "올바른 이메일 주소를 입력해 주세요.",
    sendError: "매직 링크를 보내지 못했어요.",
    sentDescription:
      "받은편지함에서 매직 링크를 눌러 확인하면 초대 메일 수신이 시작됩니다.",
    idleDescription:
      "평일마다 차분한 페어링 한 통만 보내드려요. 언제든 구독 해지할 수 있어요.",
  },
} as const;

export function SubscribeForm({ locale = "en" }: SubscribeFormProps) {
  const copy = subscribeFormCopy[locale];
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setError(copy.invalidEmail);
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
      setError(signInError.message || copy.sendError);
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
        <span className="text-[var(--md-sys-color-on-surface-variant)]">
          {copy.email}
        </span>
        <input
          type="email"
          placeholder={copy.emailPlaceholder}
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
        {isSending ? copy.sending : linkSent ? copy.sent : copy.requestInvite}
      </button>

      {error ? (
        <p className="mt-3 text-xs text-rose-600">{error}</p>
      ) : linkSent ? (
        <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          {copy.sentDescription}
        </p>
      ) : (
        <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          {copy.idleDescription}
        </p>
      )}
    </form>
  );
}
