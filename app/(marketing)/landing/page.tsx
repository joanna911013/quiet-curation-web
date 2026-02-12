import type { Metadata } from "next";
import { MarketingCtaLink, MarketingTextLink, MarketingViewEvent } from "../marketing-events";
import { ScreenLoopRoutineSection } from "./screen-loop-routine";

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
      <div className="pointer-events-none absolute left-[-120px] top-[-80px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,194,208,0.55),_rgba(236,194,208,0)_72%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[40px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(188,210,228,0.45),_rgba(188,210,228,0)_70%)] blur-2xl" />
      <div className="pointer-events-none absolute left-1/2 top-[380px] h-[300px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(246,227,203,0.55),_rgba(246,227,203,0)_72%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[6%] top-[520px] h-24 w-24 bg-[radial-gradient(rgba(198,160,102,0.55)_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-45" />
      <div className="pointer-events-none absolute left-[10%] top-[760px] h-20 w-20 bg-[radial-gradient(rgba(198,160,102,0.45)_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-40" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 pb-20 pt-8 sm:pt-12 lg:pt-14">
        <section className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 sm:space-y-6">
            <p className="text-base font-semibold uppercase tracking-[0.22em] text-[var(--md-sys-color-on-surface)] sm:text-lg">
              Quiet Curation
            </p>
            <h1 className="text-[clamp(2.25rem,4.8vw,3.5rem)] font-semibold leading-[1.08] max-w-[20ch] animate-[fadeUp_0.8s_ease-out]">
              Got 3 Minutes?
            </h1>
            <p className="text-base text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Try 3-minute pairing of literature X verse.
              <br />
              One literature quotation.
              <br />
              One Bible verse.
              <br />
              One your own reflection.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Minute 1: Open the newsletter",
                "Minute 2: Read curated pairing",
                "Minute 3: Record your reflection",
              ].map((chip, index) => (
                <span
                  key={chip}
                  className={`inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-xs ${
                    index === 0
                      ? "border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.9)] text-[var(--md-sys-color-on-surface)]"
                    : index === 1
                        ? "border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.9)] text-[var(--md-sys-color-on-surface)]"
                        : "border-[color:var(--md-sys-color-outline)] bg-[rgba(218,232,225,0.78)] text-[var(--md-sys-color-on-surface)]"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
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
              Weekday mornings | 3 minutes | email only
            </p>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Daily at 09:00 KST. Unsubscribe anytime.
            </p>
          </div>
          <div className="relative w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="pointer-events-none absolute -left-5 top-5 h-full w-full rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-low)] shadow-[0_16px_36px_rgba(0,0,0,0.08)]" />
            <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(150deg,rgba(244,224,232,0.72),rgba(226,236,247,0.65)_45%,rgba(247,238,224,0.85))] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.14)] animate-[float_8s_ease-in-out_infinite]">
              <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(186,151,95,0.75)]" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(186,151,95,0.75)]" />
              <div className="pointer-events-none absolute right-8 top-8 h-10 w-10 bg-[radial-gradient(rgba(198,160,102,0.55)_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-55" />
              <div className="relative rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] p-5">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  <span>Step by step</span>
                  <span className="rounded-full border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] px-2 py-0.5 text-[10px]">
                    ⏰ 3 minutes
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[var(--md-sys-color-on-surface)]">
                  <p>
                    <span className="font-medium">Minute 1:</span> Get the invite
                    from your email.
                  </p>
                  <p>
                    <span className="font-medium">Minute 2:</span> Meditate on short
                    devotional pairing.
                  </p>
                  <p>
                    <span className="font-medium">Minute 3:</span> Record your
                    reflection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScreenLoopRoutineSection />

        <section id="insights" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Insights
            </p>
            <h2 className="text-2xl font-semibold">
              What&apos;s the best way to spend 3 minutes?
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              For busy days, a short ritual is easier to keep than a long plan.
            </p>
          </div>
          <div className="rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(244,224,232,0.55),rgba(247,238,224,0.65))] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              {[
                {
                  minute: "01",
                  title: "Quiet",
                  body: "Start your day with a few moments to quiet your spirit.",
                },
                {
                  minute: "02",
                  title: "Read",
                  body: "Read one short literature X verse pairing.",
                },
                {
                  minute: "03",
                  title: "Reflection",
                  body: "Record your emotion and thoughts.",
                },
              ].map((item) => (
                <div
                  key={item.minute}
                  className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Minute {item.minute}
                  </p>
                  <p className="mt-2 text-base text-[var(--md-sys-color-on-surface)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              How it works
            </p>
            <h2 className="text-2xl font-semibold">MVP flow in 3 steps.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              This is the core product flow for the current MVP.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                minute: "Step 1",
                title: "Subscribe",
                text: "Join with your email in one step.",
                tone: "outlined",
              },
              {
                minute: "Step 2",
                title: "Receive",
                text: "Get one curated pairing each weekday.",
                tone: "filled",
              },
              {
                minute: "Step 3",
                title: "Reflect",
                text: "Read and record your reflection.",
                tone: "elevated",
              },
            ].map((item) => (
              <div
                key={item.minute}
                className={`rounded-2xl border p-5 ${
                  item.tone === "outlined"
                    ? "border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
                    : item.tone === "filled"
                      ? "border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)]"
                      : "border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                }`}
              >
                <p className="inline-flex min-h-[28px] items-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-[rgba(246,227,203,0.7)] px-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">
                  {item.minute}
                </p>
                <p className="mt-3 text-lg text-[var(--md-sys-color-on-surface)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            Total time: about three minutes end-to-end.
          </p>
        </section>

        <section id="sample" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Sample
            </p>
            <h2 className="text-2xl font-semibold">What a pairing feels like.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              One short passage, one verse, one meaningful connection.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(247,238,224,0.72),rgba(226,236,247,0.6))] p-6">
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(186,151,95,0.75)]" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(186,151,95,0.75)]" />
            <div className="pointer-events-none absolute right-10 top-10 h-10 w-10 bg-[radial-gradient(rgba(198,160,102,0.55)_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-55" />
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              <span>Sample issue</span>
              <span className="rounded-full border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] px-2 py-0.5 text-[10px]">
                09:00 KST
              </span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  Reading
                </div>
                <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  William Shakespeare, <em>Henry VI</em> (3 Henry VI 3.1.62-65)
                </p>
                <p className="mt-3 text-base text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
                  "My crown is called content: A crown it is that seldom kings enjoy."
                </p>
                <div className="mt-5 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Verse
                  </p>
                  <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)] max-w-[38ch]">
                    "Be still, and know that I am God." (Psalm 46:10)
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-5 shadow-[0_10px_20px_rgba(0,0,0,0.07)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  Why this pairing
                </p>
                <p className="mt-3 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  Both lines point to the same movement: release urgency and
                  return to trust. One from literature, one from Scripture.
                </p>
                <p className="mt-4 text-sm italic text-[var(--md-sys-color-on-surface)]">
                  "Just-right-sized reading for a busy day."
                </p>
              </div>
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
              {
                text: "Weekday mornings at 09:00 KST.",
                tone: "bg-[rgba(247,238,224,0.88)]",
              },
              {
                text: "Unsubscribe in one click, anytime.",
                tone: "bg-[rgba(244,224,232,0.86)]",
              },
              {
                text: "No feed, no ads, no tracking beyond delivery.",
                tone: "bg-[rgba(226,236,247,0.9)]",
              },
            ].map((item) => (
              <div
                key={item.text}
                className={`rounded-2xl border border-[color:var(--md-sys-color-outline)] p-5 text-sm text-[var(--md-sys-color-on-surface-variant)] ${item.tone}`}
              >
                {item.text}
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

        <section className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(155deg,rgba(244,224,232,0.64),rgba(226,236,247,0.58),rgba(247,238,224,0.72))] p-8 text-center">
          <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(186,151,95,0.75)]" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(186,151,95,0.75)]" />
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
