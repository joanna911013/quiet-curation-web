import type { Metadata } from "next";
import { MarketingViewEvent } from "../marketing-events";
import { SubscribeForm } from "./subscribe-form";

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

        <SubscribeForm />
      </div>
    </main>
  );
}
