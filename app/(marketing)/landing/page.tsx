import type { Metadata } from "next";
import Link from "next/link";
import { MarketingCtaLink, MarketingViewEvent } from "../marketing-events";

export const metadata: Metadata = {
  title: "Quiet Curation — Landing",
  description: "A calm daily pairing of literature and verse.",
  openGraph: {
    title: "Quiet Curation",
    description: "A calm daily pairing of literature and verse.",
    url: "https://quietcuration.xyz/landing",
  },
};

export default function LandingPage() {
  return (
    <main>
      <MarketingViewEvent event="lp_view" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-16 pt-14">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            A calm daily pairing of literature and verse.
          </h1>
          <p className="text-sm text-neutral-500">
            Short, thoughtful readings delivered with quiet context and gentle
            pacing.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <MarketingCtaLink href="/" event="lp_cta_click">
            Sign in to continue
          </MarketingCtaLink>
          <p className="text-xs text-neutral-500">
            Already opted in? Use your email to receive a magic link.
          </p>
        </div>

        <section className="grid gap-4 text-sm text-neutral-600">
          <p>Daily quiet invite, 09:00 KST.</p>
          <p>One pairing, one verse, one gentle connection.</p>
          <p>No noise, no feeds, just a single page for today.</p>
        </section>
      </div>
    </main>
  );
}
