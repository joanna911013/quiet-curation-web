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

const samplePairing = {
  id: "24a4a110-66d5-4785-afba-30dbc0dd7fa3",
  literatureAuthor: "F. Scott Fitzgerald",
  literatureTitle: "The Great Gatsby",
  pubYear: "1917",
  literatureText:
    "“Your wife doesn’t love you,” said Gatsby. “She’s never loved you. She loves me.”\n“She only married you because I was poor and she was tired of waiting for me.”\n“I did love him once—but I loved you too.”",
  verseReference: "Romans 5:8 (NIV)",
  verseText:
    "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
  rationale:
    "Why is he great? Nick says Gatsby had “an extraordinary gift for hope, a romantic readiness. But Gatsby also exposes a harder question: Was Daisy worth that kind of love? And maybe “worthiness” is not decided by the beloved, but by the one who loves. God’s love, though, is not a fantasy we maintain. It’s not based on our performance or value. It’s a love proven by an event—the Cross—given while we were still sinners.  In a strangely human way, Gatsby resembles something biblical: love that keeps moving toward someone—except his love is pointed at a person who cannot save him.",
  explanations:
    "Most of us have heard of The Great Gatsby: a man who lived inside a dream of loving Daisy—and was willing to be ruined by it.\nGatsby reunites with Daisy through Nick (her cousin), brings her to his mansion, and shows her the wealth he built as if it could finally “prove” the past was worth waiting for. Daisy is dazzled. She hooks her arm into his, and for a moment it looks like the dream is real.",
} as const;

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
                  color: "rgba(244,224,232,0.9)",
                },
                {
                  minute: "02",
                  title: "Read",
                  body: "Read one short literature X verse pairing.",
                  color: "rgba(226,236,247,0.9)",
                },
                {
                  minute: "03",
                  title: "Reflection",
                  body: "Record your emotion and thoughts.",
                  color: "rgba(218,232,225,0.78)",
                },
              ].map((item) => (
                <div
                  key={item.minute}
                  className="rounded-2xl border border-[color:var(--md-sys-color-outline)] p-4"
                  style={{ backgroundColor: item.color }}
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
            <h2 className="text-2xl font-semibold">Steps in flow</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              Simple steps to start your day with quiet ritual
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
                {item.minute === "Step 1" ? (
                  <div className="mt-4">
                    <MarketingCtaLink
                      href="/subscribe"
                      event="lp_cta_subscribe_click"
                    >
                      Join the quiet invite
                    </MarketingCtaLink>
                  </div>
                ) : null}
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
              We curate pairings of iconic literary lines with related Bible verses.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(247,238,224,0.72),rgba(226,236,247,0.6))] p-6">
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(186,151,95,0.75)]" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(186,151,95,0.75)]" />
            <div className="pointer-events-none absolute right-10 top-10 h-10 w-10 bg-[radial-gradient(rgba(198,160,102,0.55)_1.2px,transparent_1.2px)] [background-size:10px_10px] opacity-55" />
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              <span>Sample</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  Reading
                </div>
                <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.literatureAuthor}, <em>{samplePairing.literatureTitle}</em>{" "}
                  ({samplePairing.pubYear})
                </p>
                <p className="mt-3 whitespace-pre-line text-base text-[var(--md-sys-color-on-surface)]">
                  {samplePairing.literatureText}
                </p>
                <div className="mt-5 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Verse
                  </p>
                  <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)]">
                    {samplePairing.verseReference}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface)]">
                    {samplePairing.verseText}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-5 shadow-[0_10px_20px_rgba(0,0,0,0.07)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  Why this pairing
                </p>
                <p className="mt-3 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.rationale}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  About the literature
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.explanations}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="emotion-record" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              Emotion record
            </p>
            <h2 className="text-2xl font-semibold">End with one honest check-in—record it.</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              A simple preview of how the emotion step works in the app.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(247,238,224,0.72),rgba(226,236,247,0.6))] p-6">
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(186,151,95,0.75)]" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(186,151,95,0.75)]" />
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                Emotion example
              </p>
              <p className="mt-2 text-base text-[var(--md-sys-color-on-surface)]">
                How do you feel today?
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(247,238,224,0.72)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Emotion selection
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Peaceful", "Grateful", "Anxious", "Hopeful"].map((emotion, index) => (
                      <span
                        key={emotion}
                        className={`inline-flex min-h-[30px] items-center rounded-full border px-3 text-xs ${
                          index === 0
                            ? "border-[color:var(--md-sys-color-outline)] bg-[rgba(218,232,225,0.9)] text-[var(--md-sys-color-on-surface)]"
                            : "border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]"
                        }`}
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.78)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    Optional memo
                  </p>
                  <div className="mt-3 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] px-3 py-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                    Today I want to carry calm into my next conversation.
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                    Up to 160 characters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              FAQ
            </p>
            <h2 className="text-2xl font-semibold">Common questions.</h2>
          </div>
          <div className="grid gap-3">
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
              <details
                key={item.q}
                className="group rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container)] open:bg-[var(--md-sys-color-surface-container-high)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-sm font-semibold text-[var(--md-sys-color-on-surface)] [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 text-lg leading-none text-[var(--md-sys-color-on-surface-variant)] transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
                    {item.a}
                  </p>
                </div>
              </details>
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
          <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            No spam. Unsubscribe anytime. Privacy-first delivery.
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
