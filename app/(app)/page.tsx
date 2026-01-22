import Link from "next/link";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabaseServer";
import {
  getTodayPairing,
  type TodayPairing,
  type VerseRow,
} from "@/lib/queries/getTodayPairing";

export const dynamic = "force-dynamic";

const CLAMP_2_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
} as const;

const trimText = (text: string) => text.replace(/\s+/g, " ").trim();

const truncateAtWord = (text: string, max: number) => {
  const cleaned = trimText(text);
  if (cleaned.length <= max) {
    return cleaned;
  }
  const slice = cleaned.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${trimmed.trimEnd()}...`;
};

const getVerseText = (verse: VerseRow | null) =>
  verse?.verse_text?.trim() || verse?.text?.trim() || "";

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

const buildAttributionParts = (pairing: TodayPairing) => {
  const author = pairing.literature_author?.trim();
  const title = pairing.literature_title?.trim();
  if (!author && !title) {
    return null;
  }
  return { author: author || null, title: title || null };
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

export default async function HomePage() {
  const supabase = await createSupabaseServer();
  const locale = await resolveLocale();
  const { pairing, error, isFallback } = await getTodayPairing(supabase, locale);

  const verse = pairing?.verse ?? null;
  const verseReference = pairing ? formatVerseReference(verse) : null;
  const verseText = pairing ? getVerseText(verse) : "";
  const versePreview = verseText;
  const literaturePreview = pairing?.literature_text
    ? truncateAtWord(pairing.literature_text, 140)
    : "";
  const attribution = pairing ? buildAttributionParts(pairing) : null;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 pb-8 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Today
        </p>
        <h1 className="text-2xl font-semibold">Quiet Curation</h1>
        <p className="text-sm text-neutral-500">
          A calm daily pairing to start the day.
        </p>
      </header>

      {error && !pairing ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Unable to load today&apos;s pairing.
        </div>
      ) : null}

      {pairing && verseReference && versePreview ? (
        <Link
          href={`/c/${pairing.id}`}
          data-fallback={isFallback ? "true" : "false"}
          className="rounded-2xl border border-neutral-200/80 bg-white p-4 transition hover:border-neutral-300"
        >
          <div className="text-xs font-semibold text-neutral-500 truncate">
            {verseReference}
          </div>
          <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed text-neutral-900">
            {versePreview}
          </p>
          {literaturePreview ? (
            <p
              className="mt-3 text-sm text-neutral-600"
              style={CLAMP_2_STYLE}
            >
              {literaturePreview}
            </p>
          ) : null}
          {attribution ? (
            <p className="mt-2 text-xs text-neutral-500">
              &mdash;{" "}
              {attribution.author ? <span>{attribution.author}</span> : null}
              {attribution.author && attribution.title ? ", " : null}
              {attribution.title ? (
                <em className="italic">{attribution.title}</em>
              ) : null}
            </p>
          ) : null}
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
