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

type SubscribePageProps = {
  locale?: "en" | "ko";
};

const subscribeCopy = {
  en: {
    label: "Subscribe",
    title: "Join the quiet invite.",
    subtitle: "We send one calm pairing each morning (09:00 KST).",
  },
  ko: {
    label: "구독",
    title: "조용한 초대에 참여해 보세요.",
    subtitle: "매일 아침(09:00 KST), 차분한 페어링을 한 번 보내드려요.",
  },
} as const;

export default function SubscribePage({ locale = "en" }: SubscribePageProps) {
  const copy = subscribeCopy[locale];

  return (
    <main>
      <MarketingViewEvent event="sub_view" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pb-16 pt-14">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]">
            {copy.label}
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            {copy.title}
          </h1>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
            {copy.subtitle}
          </p>
        </header>

        <SubscribeForm locale={locale} />
      </div>
    </main>
  );
}
