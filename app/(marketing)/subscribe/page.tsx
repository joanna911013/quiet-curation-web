import type { Metadata } from "next";
import { MarketingViewEvent } from "../marketing-events";

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
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Subscribe
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            Join the quiet invite.
          </h1>
          <p className="text-sm text-neutral-500">
            We send one calm pairing each morning (09:00 KST).
          </p>
        </header>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-neutral-500">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl border border-neutral-200 bg-transparent px-4 text-base outline-none focus:border-neutral-400"
            />
          </label>
          <button
            type="button"
            className="mt-4 inline-flex w-fit items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
          >
            Request invite
          </button>
          <p className="mt-3 text-xs text-neutral-400">
            Placeholder form. Wire this to the opt-in flow when ready.
          </p>
        </div>
      </div>
    </main>
  );
}
