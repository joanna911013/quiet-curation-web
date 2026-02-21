import type { Metadata } from "next";
import { MarketingCtaButton, MarketingViewEvent } from "../marketing-events";

export const metadata: Metadata = {
  title: "Quiet Curation — Subscribe",
  description: "Subscribe for calm daily readings.",
  openGraph: {
    title: "Quiet Curation — Subscribe",
    description: "Subscribe for calm daily readings.",
    url: "https://quietcuration.xyz/subscribe",
  },
};

export default function SubscribePage() {
  return (
    <main>
      <MarketingViewEvent event="sub_view" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pb-16 pt-14">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
            Subscribe
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            Join the quiet invite.
          </h1>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
            We send one calm pairing each morning (09:00 KST).
          </p>
        </header>

        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-[var(--md-sys-color-on-surface-variant)]">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-white/70 px-4 text-base outline-none focus:border-[var(--md-sys-color-primary)]"
            />
          </label>
          <MarketingCtaButton
            event="sub_cta_request_click"
            className="mt-4 inline-flex w-fit items-center rounded-[20px] bg-[var(--md-sys-color-primary)] px-5 py-2 text-sm font-medium text-[var(--md-sys-color-on-primary)] min-h-[44px] transition hover:brightness-95"
          >
            Request invite
          </MarketingCtaButton>
          <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            Placeholder form. Wire this to the opt-in flow when ready.
          </p>
        </div>
      </div>
    </main>
  );
}
