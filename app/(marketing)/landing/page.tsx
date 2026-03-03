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

type LandingLocale = "en" | "ko";

type LandingPageProps = {
  locale?: LandingLocale;
};

const LANDING_TONES = {
  rose: "rgba(244,224,232,0.9)",
  sky: "rgba(226,236,247,0.9)",
  sage: "rgba(218,232,225,0.78)",
  corner: "rgba(132,138,150,0.62)",
} as const;

const landingCopy = {
  en: {
    heroTitle: "Got 3 Minutes?",
    heroLines: [
      "Try 3-minute pairing of literature X verse.",
      "One literature quotation.",
      "One Bible verse.",
      "One your own reflection.",
    ],
    heroChips: [
      "Minute 1: Open the newsletter",
      "Minute 2: Read curated pairing",
      "Minute 3: Record your reflection",
    ],
    primaryCta: "Join the quiet invite",
    secondaryCta: "See a sample pairing",
    stepByStep: "Step by step",
    stepLines: [
      "Minute 1: Get the invite from your email.",
      "Minute 2: Meditate on short devotional pairing.",
      "Minute 3: Record your reflection.",
    ],
    insights: {
      label: "Insights",
      title: "What's the best way to spend 3 minutes?",
      subtitle: "For busy days, a short ritual is easier to keep than a long plan.",
      items: [
        {
          minute: "01",
          title: "Quiet",
          body: "Start your day with a few moments to quiet your spirit.",
          color: LANDING_TONES.rose,
        },
        {
          minute: "02",
          title: "Read",
          body: "Read one short literature X verse pairing.",
          color: LANDING_TONES.sky,
        },
        {
          minute: "03",
          title: "Reflection",
          body: "Record your emotion and thoughts.",
          color: LANDING_TONES.sage,
        },
      ],
    },
    how: {
      label: "How it works",
      title: "Start to subscribe as a newsletter first",
      subtitle: "Simple steps to start your day with quiet ritual",
      items: [
        { minute: "1", title: "Subscribe", text: "Join with your email in one step.", tone: "outlined" },
        { minute: "2", title: "Receive", text: "Get one curated pairing each weekday.", tone: "filled" },
        { minute: "3", title: "Reflect", text: "Read and record your reflection.", tone: "elevated" },
      ],
    },
    sample: {
      label: "Sample",
      title: "What a pairing feels like.",
      subtitle: "We curate pairings of iconic literary lines with related Bible verses.",
      badge: "Sample",
      reading: "Reading",
      verse: "Verse",
      about: "About the literature",
      why: "Why this pairing",
    },
    emotion: {
      label: "Emotion record",
      title: "End with one honest check-in—record it.",
      subtitle: "A simple preview of how the emotion step works in the app.",
      example: "Emotion example",
      question: "How do you feel today?",
      selection: "Emotion selection",
      memo: "Optional memo",
      memoExample: "Today I want to carry calm into my next conversation.",
      memoLimit: "Up to 160 characters.",
      chips: ["Peaceful", "Grateful", "Anxious", "Hopeful"],
    },
    faq: {
      label: "FAQ",
      title: "Common questions.",
      items: [
        { q: "Is this a newsletter?", a: "It’s a single daily pairing, not a stream of updates." },
        { q: "How long does it take?", a: "About three minutes, end to end." },
        { q: "When do you send it?", a: "Every morning at 09:00 KST." },
        { q: "Can I stop anytime?", a: "Yes, unsubscribe in one click." },
        { q: "What will I receive?", a: "One short literature excerpt, one verse, and a brief connection." },
        { q: "Do you track me?", a: "No tracking beyond basic email delivery." },
      ],
    },
    final: {
      label: "Final invite",
      title: "Begin a quiet daily ritual.",
      subtitle: "One calm pairing each morning, delivered by email.",
      footnote: "No spam. Unsubscribe anytime. Privacy-first delivery.",
    },
  },
  ko: {
    heroTitle: "3분만 투자해 볼까요?",
    heroLines: [
      "문학 X 성경 3분 페어링을 만나보세요.",
      "문학 한 줄.",
      "성경 한 절.",
      "그리고 나의 짧은 기록.",
    ],
    heroChips: [
      "1분: 메일 열기",
      "2분: 큐레이션 페어링 읽기",
      "3분: 감정 기록하기",
    ],
    primaryCta: "조용한 초대 받기",
    secondaryCta: "샘플 페어링 보기",
    stepByStep: "Step by step",
    stepLines: [
      "1분: 이메일로 받은 초대를 엽니다.",
      "2분: 짧은 묵상 페어링을 읽습니다.",
      "3분: 오늘의 마음을 기록합니다.",
    ],
    insights: {
      label: "인사이트",
      title: "3분을 가장 잘 쓰는 방법은 무엇일까요?",
      subtitle: "바쁜 날일수록 긴 계획보다 짧은 루틴이 더 오래갑니다.",
      items: [
        {
          minute: "01",
          title: "고요",
          body: "하루를 시작하기 전, 마음을 잠깐 고요하게 만듭니다.",
          color: LANDING_TONES.rose,
        },
        {
          minute: "02",
          title: "읽기",
          body: "문학 X 성경 페어링 한 세트를 읽습니다.",
          color: LANDING_TONES.sky,
        },
        {
          minute: "03",
          title: "기록",
          body: "오늘의 감정과 생각을 짧게 남깁니다.",
          color: LANDING_TONES.sage,
        },
      ],
    },
    how: {
      label: "이용 방법",
      title: "먼저 뉴스레터 구독부터 시작해요",
      subtitle: "조용한 하루 루틴을 시작하는 간단한 3단계",
      items: [
        { minute: "1", title: "구독", text: "이메일 한 번으로 참여할 수 있어요.", tone: "outlined" },
        { minute: "2", title: "수신", text: "평일마다 큐레이션 페어링 한 통을 받아요.", tone: "filled" },
        { minute: "3", title: "기록", text: "읽고, 감정을 짧게 남겨 보세요.", tone: "elevated" },
      ],
    },
    sample: {
      label: "샘플",
      title: "페어링은 이런 느낌이에요.",
      subtitle: "상징적인 문학 문장과 연결된 성경 구절을 함께 큐레이션합니다.",
      badge: "샘플",
      reading: "읽기",
      verse: "성경 구절",
      about: "문학 소개",
      why: "왜 이 페어링인가요",
    },
    emotion: {
      label: "감정 기록",
      title: "마지막 1분은 솔직한 체크인—기록으로 남겨요.",
      subtitle: "앱에서 감정 기록이 어떻게 동작하는지 미리 볼 수 있어요.",
      example: "감정 예시",
      question: "오늘 기분은 어떤가요?",
      selection: "감정 선택",
      memo: "선택 메모",
      memoExample: "오늘은 다음 대화에서도 평온함을 지키고 싶다.",
      memoLimit: "최대 160자까지 입력할 수 있어요.",
      chips: ["평안", "감사", "불안", "소망"],
    },
    faq: {
      label: "FAQ",
      title: "자주 묻는 질문",
      items: [
        { q: "이건 뉴스레터인가요?", a: "업데이트성 뉴스레터가 아니라 하루 한 번의 페어링 초대입니다." },
        { q: "얼마나 걸리나요?", a: "처음부터 끝까지 약 3분이면 충분해요." },
        { q: "언제 보내주나요?", a: "매일 오전 09:00 KST에 발송됩니다." },
        { q: "언제든 멈출 수 있나요?", a: "네, 한 번의 구독 해지로 바로 중단할 수 있어요." },
        { q: "무엇을 받게 되나요?", a: "짧은 문학 문장 하나, 성경 한 절, 그리고 간단한 연결 설명입니다." },
        { q: "사용자 추적을 하나요?", a: "기본적인 이메일 전달 로그 외 별도 추적은 하지 않습니다." },
      ],
    },
    final: {
      label: "마지막 초대",
      title: "조용한 하루 루틴을 시작해 보세요.",
      subtitle: "매일 아침, 차분한 페어링 한 통을 이메일로 보내드립니다.",
      footnote: "스팸 없음. 언제든 구독 해지 가능. 프라이버시 우선.",
    },
  },
} as const;

export default function LandingPage({ locale = "en" }: LandingPageProps) {
  const copy = landingCopy[locale];
  const subscribeHref = locale === "ko" ? "/ko/subscribe" : "/subscribe";

  return (
    <main className="relative isolate overflow-hidden bg-[linear-gradient(180deg,rgba(244,224,232,0.48)_0%,rgba(226,236,247,0.44)_46%,rgba(218,232,225,0.36)_100%)]">
      <MarketingViewEvent event="lp_view" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_74%_at_50%_-6%,rgba(244,224,232,0.56),rgba(226,236,247,0.46)_42%,rgba(218,232,225,0.34)_64%,rgba(255,255,255,0)_80%)]" />
      <div className="pointer-events-none absolute inset-x-[-20%] top-[-220px] h-[620px] bg-[radial-gradient(ellipse_at_center,rgba(244,224,232,0.48),rgba(226,236,247,0.42)_44%,rgba(218,232,225,0.26)_68%,rgba(255,255,255,0)_82%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-150px] top-[-90px] h-[430px] w-[430px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,224,232,0.66),_rgba(244,224,232,0)_72%)] blur-3xl animate-[float_15s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[-130px] top-[20px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(226,236,247,0.64),_rgba(226,236,247,0)_72%)] blur-3xl animate-[float_18s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-1/2 top-[340px] h-[340px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(218,232,225,0.56),_rgba(218,232,225,0)_72%)] blur-3xl animate-[float_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-[8%] top-[780px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,224,232,0.42),_rgba(244,224,232,0)_72%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 pb-20 pt-8 sm:pt-12 lg:pt-14">
        <section className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 sm:space-y-6">
            <p className="text-base font-semibold uppercase tracking-[0.22em] text-[var(--md-sys-color-on-surface)] sm:text-lg">
              Quiet Curation
            </p>
            <h1 className="text-[clamp(2.25rem,4.8vw,3.5rem)] font-semibold leading-[1.08] max-w-[20ch] animate-[fadeUp_0.8s_ease-out]">
              {copy.heroTitle}
            </h1>
            <p className="text-base text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              {copy.heroLines[0]}
              <br />
              {copy.heroLines[1]}
              <br />
              {copy.heroLines[2]}
              <br />
              {copy.heroLines[3]}
            </p>
            <div className="flex flex-wrap gap-2">
              {copy.heroChips.map((chip, index) => (
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
              <MarketingCtaLink href={subscribeHref} event="lp_cta_subscribe_click">
                {copy.primaryCta}
              </MarketingCtaLink>
              <MarketingTextLink
                href="#sample"
                event="lp_cta_secondary_click"
                className="text-sm text-[var(--md-sys-color-secondary)] underline underline-offset-4 hover:text-[var(--md-sys-color-on-surface)]"
              >
                {copy.secondaryCta}
              </MarketingTextLink>
            </div>
          </div>
          <div className="relative w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="pointer-events-none absolute -left-5 top-5 h-full w-full rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.52)] shadow-[0_16px_36px_rgba(0,0,0,0.08)]" />
            <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(150deg,rgba(244,224,232,0.72),rgba(226,236,247,0.66)_44%,rgba(218,232,225,0.76)_100%)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.14)] animate-[float_8s_ease-in-out_infinite]">
              <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(132,138,150,0.62)]" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(132,138,150,0.62)]" />
              <div className="relative rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(255,255,255,0.8)] p-5">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  <span>{copy.stepByStep}</span>
                  <span className="rounded-full border border-[color:var(--md-sys-color-outline)] bg-[rgba(218,232,225,0.78)] px-2 py-0.5 text-[10px]">
                    ⏰ 3 minutes
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[var(--md-sys-color-on-surface)]">
                  {copy.stepLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScreenLoopRoutineSection locale={locale} />

        <section id="insights" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              {copy.insights.label}
            </p>
            <h2 className="text-2xl font-semibold">
              {copy.insights.title}
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              {copy.insights.subtitle}
            </p>
          </div>
          <div className="rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(244,224,232,0.56),rgba(226,236,247,0.52),rgba(218,232,225,0.5))] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              {copy.insights.items.map((item) => (
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
              {copy.how.label}
            </p>
            <h2 className="text-2xl font-semibold">{copy.how.title}</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              {copy.how.subtitle}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.how.items.map((item) => (
              <div
                key={item.minute}
                className={`rounded-2xl border p-5 ${
                  item.tone === "outlined"
                    ? "border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.58)]"
                    : item.tone === "filled"
                      ? "border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.62)]"
                      : "border-[color:var(--md-sys-color-outline)] bg-[rgba(218,232,225,0.58)] shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                }`}
              >
                <p className="inline-flex min-h-[28px] items-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.72)] px-2.5 text-[11px] uppercase tracking-[0.16em] text-[var(--md-sys-color-on-surface-variant)]">
                  {item.minute}
                </p>
                <p className="mt-3 text-lg text-[var(--md-sys-color-on-surface)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {item.text}
                </p>
                {item.minute === "1" ? (
                  <div className="mt-4">
                    <MarketingCtaLink
                      href={subscribeHref}
                      event="lp_cta_subscribe_click"
                    >
                      {copy.primaryCta}
                    </MarketingCtaLink>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section id="sample" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              {copy.sample.label}
            </p>
            <h2 className="text-2xl font-semibold">{copy.sample.title}</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              {copy.sample.subtitle}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(244,224,232,0.54),rgba(226,236,247,0.58),rgba(218,232,225,0.52))] p-6">
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(132,138,150,0.62)]" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(132,138,150,0.62)]" />
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              <span>{copy.sample.badge}</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(255,255,255,0.84)] p-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  {copy.sample.reading}
                </div>
                <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.literatureAuthor}, <em>{samplePairing.literatureTitle}</em>{" "}
                  ({samplePairing.pubYear})
                </p>
                <p className="mt-3 whitespace-pre-line text-base text-[var(--md-sys-color-on-surface)]">
                  {samplePairing.literatureText}
                </p>
                <div className="mt-5 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.66)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    {copy.sample.verse}
                  </p>
                  <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface)]">
                    {samplePairing.verseReference}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface)]">
                    {samplePairing.verseText}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.64)] p-5 shadow-[0_10px_20px_rgba(0,0,0,0.07)]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  {copy.sample.about}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.explanations}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                  {copy.sample.why}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  {samplePairing.rationale}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="emotion-record" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              {copy.emotion.label}
            </p>
            <h2 className="text-2xl font-semibold">{copy.emotion.title}</h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch]">
              {copy.emotion.subtitle}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(160deg,rgba(244,224,232,0.52),rgba(226,236,247,0.56),rgba(218,232,225,0.5))] p-6">
            <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(132,138,150,0.62)]" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(132,138,150,0.62)]" />
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(255,255,255,0.84)] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                {copy.emotion.example}
              </p>
              <p className="mt-2 text-base text-[var(--md-sys-color-on-surface)]">
                {copy.emotion.question}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.66)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    {copy.emotion.selection}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {copy.emotion.chips.map((emotion, index) => (
                      <span
                        key={emotion}
                        className={`inline-flex min-h-[30px] items-center rounded-full border px-3 text-xs ${
                          index === 0
                            ? "border-[rgba(162,131,149,0.9)] bg-[rgba(244,224,232,0.96)] text-[rgb(86,66,80)] font-semibold shadow-[0_0_0_2px_rgba(186,151,171,0.22)]"
                            : "border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.78)] text-[var(--md-sys-color-on-surface-variant)]"
                        }`}
                      >
                        {emotion}
                      </span>
                    ))}
                    <span className="inline-flex min-h-[30px] items-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.78)] px-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                      ...
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(244,224,232,0.78)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
                    {copy.emotion.memo}
                  </p>
                  <div className="mt-3 rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(255,255,255,0.88)] px-3 py-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                    {copy.emotion.memoExample}
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                    {copy.emotion.memoLimit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
              {copy.faq.label}
            </p>
            <h2 className="text-2xl font-semibold">{copy.faq.title}</h2>
          </div>
          <div className="grid gap-3">
            {copy.faq.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[rgba(226,236,247,0.56)] open:bg-[rgba(218,232,225,0.58)]"
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

        <section className="relative overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[linear-gradient(155deg,rgba(244,224,232,0.66),rgba(226,236,247,0.58),rgba(218,232,225,0.58))] p-8 text-center">
          <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(132,138,150,0.62)]" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(132,138,150,0.62)]" />
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
            {copy.final.label}
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {copy.final.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-[38ch] mx-auto">
            {copy.final.subtitle}
          </p>
          <p className="mt-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            {copy.final.footnote}
          </p>
          <div className="mt-6 flex justify-center">
            <MarketingCtaLink href={subscribeHref} event="lp_cta_subscribe_click">
              {copy.primaryCta}
            </MarketingCtaLink>
          </div>
        </section>
      </div>
    </main>
  );
}
