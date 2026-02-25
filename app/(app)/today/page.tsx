import Link from "next/link";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabaseServer";
import {
  getTodayPairing,
  type TodayPairing,
  type VerseRow,
} from "@/lib/queries/getTodayPairing";
import { resolveVerseText } from "@/lib/verses";
import { logError, logWarn } from "@/lib/observability";
import { RetryButton } from "@/components/retry-button";

export const dynamic = "force-dynamic";

const getVerseText = (verse: VerseRow | null) =>
  resolveVerseText(verse?.verse_text);

const formatVerseReference = (verse: VerseRow | null) => {
  if (!verse) {
    return null;
  }
  const translation = verse.translation?.trim();
  if (!translation) {
    return null;
  }
  const canonical = verse.canonical_ref?.trim();
  const fallback =
    verse.book && verse.chapter != null && verse.verse != null
      ? `${verse.book} ${verse.chapter}:${verse.verse}`
      : "";
  const base = canonical || fallback;
  if (!base) {
    return null;
  }
  return `${base} (${translation})`;
};

const formatHeaderDate = (dateValue: string | null | undefined, locale: string) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  const formatter = new Intl.DateTimeFormat(
    locale === "ko" ? "ko-KR" : "en-US",
    {
      year: "numeric",
      month: locale === "ko" ? "long" : "short",
      day: "numeric",
    },
  );
  return formatter.format(date);
};

const resolveLocale = async () => {
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language")?.toLowerCase() ?? "";
  const primary = acceptLanguage.split(",")[0]?.trim() ?? "";
  if (primary.startsWith("ko")) {
    return "ko";
  }
  return "en";
};

const collapseText = (value: string | null | undefined) =>
  (value ?? "").replace(/\s+/g, " ").trim();

const buildPreviewText = (pairing: TodayPairing, verseText: string) => {
  const literature = collapseText(pairing.literature_text);
  if (literature) {
    return literature;
  }
  return collapseText(verseText);
};

export default async function HomePage() {
  const requestId = randomUUID();
  const supabase = await createSupabaseServer();
  const locale = await resolveLocale();
  const tagline =
    locale === "ko"
      ? "오늘의 문학x성경 페어링으로 차분한 하루를 시작해보세요."
      : "Start your day with this calm daily pairing of literature and verse.";
  let pairing: TodayPairing | null = null;
  let error: string | null = null;
  let isFallback = false;
  try {
    const result = await getTodayPairing(supabase, locale);
    pairing = result.pairing;
    error = result.error;
    isFallback = result.isFallback;
  } catch (error) {
    logError("today.fetch_failed", {
      request_id: requestId,
      route: "today",
      locale,
      has_pairing: false,
      fallback_used: false,
    }, error);
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Quiet Curation</h1>
          <p className="text-sm text-neutral-500">
            {tagline}
          </p>
          <p className="text-xs text-neutral-500">
            {formatHeaderDate(null, locale)}
          </p>
        </header>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Unable to load today&apos;s pairing.
        </div>
        <RetryButton className="self-start" />
      </main>
    );
  }
  if (error) {
    logError("today.fetch_failed", {
      request_id: requestId,
      route: "today",
      locale,
      has_pairing: Boolean(pairing?.id),
      fallback_used: isFallback,
      error_message: error,
    });
  }

  const verse = pairing?.verse ?? null;
  const verseReference = pairing ? formatVerseReference(verse) : null;
  const verseText = pairing ? getVerseText(verse) : "";
  const previewText = pairing ? buildPreviewText(pairing, verseText) : "";
  const headerDate = formatHeaderDate(null, locale);

  if (pairing) {
    const missing: string[] = [];
    if (!verse) {
      missing.push("verse_row");
    } else {
      if (!verse.translation?.trim()) {
        missing.push("translation");
      }
      if (!verse.verse_text?.trim()) {
        missing.push("verse_text");
      }
    }
    if (missing.length > 0) {
      logWarn("pairing.join_failed", {
        request_id: requestId,
        route: "today",
        locale,
        pairing_id: pairing.id,
        curation_id: pairing.curation_id ?? null,
        verse_id: pairing.verse_id ?? null,
        missing,
        action: "omit_pairing",
      });
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Quiet Curation</h1>
        <p className="text-sm text-neutral-500">
          {tagline}
        </p>
        <p className="text-xs text-neutral-500">
          {headerDate}
        </p>
      </header>

      {error && !pairing ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            Unable to load today&apos;s pairing.
          </div>
          <RetryButton className="self-start" />
        </div>
      ) : null}

      {pairing && verseReference && previewText ? (
        <Link
          href={`/c/${pairing.id}`}
          data-fallback={isFallback ? "true" : "false"}
          className="todayPreviewCard"
        >
          <div className="todayPreviewRef">{verseReference}</div>
          <p className="todayPreviewText">{previewText}</p>
        </Link>
      ) : null}

      <div className="mt-2 flex flex-col gap-3">
        <Link
          href="/emotion"
          className="button buttonPrimary inline-flex items-center justify-center"
        >
          Continue
        </Link>
        <Link
          href="/profile"
          className="text-xs text-neutral-500 underline"
        >
          Profile
        </Link>
      </div>
    </main>
  );
}
