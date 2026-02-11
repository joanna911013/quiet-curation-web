import type { Metadata } from "next";
import { MarketingCtaLink, MarketingTextLink, MarketingViewEvent } from "../marketing-events";

export const metadata: Metadata = {
  title: "Quiet Curation — Landing",
  description: "A calm 3‑minute pairing of literature and verse, delivered by email.",
  openGraph: {
    title: "Quiet Curation",
    description: "A calm 3‑minute pairing of literature and verse, delivered by email.",
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
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--md-sys-color-on-surface-variant)]">
              3-minute ritual
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Quiet Curation
            </p>
            <h1 className="text-[clamp(2.25rem,4.8vw,3.5rem)] font-semibold leading-[1.08] max-w-[20ch] animate-[fadeUp_0.8s_ease-out]">
              A 3‑minute quiet pairing for your morning.
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
              Weekday mornings · 3 minutes · email only
            </p>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Daily at 09:00 KST. Unsubscribe anytime.
            </p>
          </div>
          <div className="relative w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="pointer-events-none absolute -left-6 top-6 h-full w-full rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-low)] shadow-[0_16px_36px_rgba(0,0,0,0.08)]" />
            <div className="relative rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.14)] animate-[float_8s_ease-in-out_infinite]">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                <span>Pairing preview</span>
                <span className="rounded-full border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] px-2 py-0.5 text-[10px]">
                  3 minutes
                </span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Reading
                  </p>
                  <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)]">
                    “My crown is called content: a crown seldom kings enjoy.”
                  </p>
                  <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                    William Shakespeare · <em>Henry VI</em>
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Verse
                  </p>
                  <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)]">
                    “Be still, and know that I am God.”
                  </p>
                  <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                    Psalm 46:10
                  </p>
                </div>
              </div>
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
              Open the invite, read one pairing, return to your day.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Open the quiet invite in your inbox.",
              "Read one literature × verse pairing.",
              "Take a breath and return to your day.",
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
              — William Shakespeare, <em>Henry VI</em> (3 Henry VI 3.1.62–65)
            </p>
            <p className="mt-3 text-base text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
              “My crown is called content: A crown it is that seldom kings enjoy.”
            </p>
            <div className="mt-6 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                Verse
              </p>
              <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
                “Be still, and know that I am God. (Psalm 46:10)”
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
              Daily at 09:00 KST. Unsubscribe anytime. No feed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Weekday mornings at 09:00 KST.",
              "Unsubscribe in one click, anytime.",
              "No feed, no ads, no tracking beyond delivery.",
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
                q: "When do you send it?",
                a: "Every morning at 09:00 KST.",
              },
              {
                q: "Can I stop anytime?",
                a: "Yes, unsubscribe in one click.",
              },
              {
                q: "What will I receive?",
                a: "One short literature excerpt, one verse, and a brief connection.",
              },
              {
                q: "Do you track me?",
                a: "No tracking beyond basic email delivery.",
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
            Begin a quiet daily ritual.
          </h2>
          <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch] mx-auto">
            One calm pairing each morning, delivered by email.
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
