import type { Metadata } from "next";
import { MarketingCtaLink, MarketingTextLink, MarketingViewEvent } from "../marketing-events";

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
    <main className="relative overflow-hidden">
      <MarketingViewEvent event="lp_view" />
      <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(11,107,90,0.14),_rgba(11,107,90,0)_70%)] blur-2xl opacity-60" />
      <div className="pointer-events-none absolute right-[-140px] top-[120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(74,99,93,0.12),_rgba(74,99,93,0)_70%)] blur-2xl opacity-70" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 pb-20 pt-8 sm:pt-12 lg:pt-14">
        <section className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 sm:space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Quiet Curation
            </p>
            <h1 className="text-[clamp(2.25rem,4.8vw,3.5rem)] font-semibold leading-[1.08] max-w-[20ch] animate-[fadeUp_0.8s_ease-out]">
              Break the screen‑loop in 3 minutes.
            </h1>
            <p className="text-base text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              One literature × verse pairing, delivered by email. No feed. No
              noise.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <MarketingCtaLink href="/subscribe" event="lp_cta_subscribe_click">
                Join the quiet invite
              </MarketingCtaLink>
              <MarketingTextLink
                href="#sample"
                event="lp_cta_secondary_click"
                className="text-sm text-[var(--md-sys-color-secondary)] underline underline-offset-4 hover:text-[var(--md-sys-color-on-surface)]"
              >
                See a sample pairing
              </MarketingTextLink>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--md-sys-color-on-surface-variant)]">
              screen‑loop → 3‑minute dopamine detox → quiet invite (email)
            </p>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Daily at 09:00 KST. Unsubscribe anytime.
            </p>
          </div>
          <div className="w-full max-w-md justify-self-center rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)] animate-[float_8s_ease-in-out_infinite] lg:justify-self-end">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Screen loop
            </div>
            <div className="mt-3 space-y-4">
              <div className="h-3 w-4/5 rounded-full bg-[color:var(--md-sys-color-outline)] opacity-60" />
              <div className="h-3 w-3/5 rounded-full bg-[color:var(--md-sys-color-outline)] opacity-60" />
              <div className="h-3 w-5/6 rounded-full bg-[color:var(--md-sys-color-outline)] opacity-60" />
            </div>
            <div className="mt-6 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                Quiet invite
              </p>
              <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                A single pairing, quietly delivered.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              How it works
            </p>
            <h2 className="text-2xl font-semibold">Three calm steps.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              A 3‑minute ritual that trades noise for one thoughtful pairing.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Open the quiet invite in your inbox.",
              "Read one literature × verse pairing.",
              "Close the loop and return to your day.",
            ].map((text, index) => (
              <div
                key={text}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  Step {index + 1}
                </p>
                <p className="mt-3">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="insights" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Insights
            </p>
            <h2 className="text-2xl font-semibold">A short reset loop.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Placeholder section for the attention‑loop framework.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Screen loop → overstimulation",
              "Quiet reset → 3 minutes",
              "Return with a clearer mind",
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]"
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <section id="principles" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Principles
            </p>
            <h2 className="text-2xl font-semibold">What we will and won’t do.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Placeholder cards for the product principles.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["One pairing", "No feed", "No noise"].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]"
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <section id="for-not-for" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              For / Not for
            </p>
            <h2 className="text-2xl font-semibold">A clear fit.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Placeholder list for who this is for, and who it isn’t.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]">
              For: people who want a small daily ritual.
            </div>
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]">
              Not for: people who want constant updates.
            </div>
          </div>
        </section>

        <section id="sample" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Sample
            </p>
            <h2 className="text-2xl font-semibold">What a pairing feels like.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              One short passage, one verse, one gentle connection.
            </p>
          </div>
          <div className="rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Reading
            </div>
            <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
              — Author, <em>Work Title</em>
            </p>
            <p className="mt-3 text-base text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
              “Sample excerpt text goes here. Calm, concise, and grounded.”
            </p>
            <div className="mt-6 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                Verse
              </p>
              <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
                “Sample verse text. (Book 1:1)”
              </p>
            </div>
          </div>
        </section>

        <section id="trust" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Trust
            </p>
            <h2 className="text-2xl font-semibold">Small, steady, and clean.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Built to stay quiet: no feed, no ads, no pressure.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Daily at 09:00 KST. Nothing more.",
              "Unsubscribe anytime in one click.",
              "No public feed, no endless scroll.",
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)]"
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              FAQ
            </p>
            <h2 className="text-2xl font-semibold">Common questions.</h2>
          </div>
          <div className="grid gap-4">
            {[
              {
                q: "Is this a newsletter?",
                a: "It’s a single daily pairing, not a stream of updates.",
              },
              {
                q: "How long does it take?",
                a: "About three minutes, end to end.",
              },
              {
                q: "Can I stop anytime?",
                a: "Yes, unsubscribe in one click.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5"
              >
                <p className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
                  {item.q}
                </p>
                <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
            Final invite
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Step out of the loop, quietly.
          </h2>
          <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch] mx-auto">
            One calm pairing each morning. That’s all.
          </p>
          <div className="mt-6 flex justify-center">
            <MarketingCtaLink href="/subscribe" event="lp_cta_subscribe_click">
              Join the quiet invite
            </MarketingCtaLink>
          </div>
        </section>
      </div>
    </main>
  );
}
