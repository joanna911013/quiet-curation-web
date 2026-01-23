"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveButton } from "./save-button";
import { resolveVerseText } from "@/lib/verses";

type PairingDetail = {
  id: string;
  pairing_date: string | null;
  literature_text: string | null;
  literature_source: string | null;
  literature_author: string | null;
  literature_work: string | null;
  literature_title: string | null;
  rationale_short: string | null;
  verse: VerseRow | null;
};

type VerseRow = {
  id: string;
  translation: string | null;
  canonical_ref: string | null;
  verse_text: string | null;
  book: string | null;
  chapter: number | null;
  verse: number | null;
};

type DetailViewProps = {
  pairing: PairingDetail;
  initialSaved: boolean;
  initialSavedAt: string | null;
};

const CLAMP_4_STYLE = {
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
} as const;

const trimText = (text: string) => text.replace(/\s+/g, " ").trim();

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

const buildAttributionParts = (pairing: PairingDetail) => {
  const author = pairing.literature_author?.trim();
  const title = pairing.literature_title?.trim();
  if (!author && !title) {
    return null;
  }
  return { author: author || null, title: title || null };
};

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function DetailView({
  pairing,
  initialSaved,
  initialSavedAt,
}: DetailViewProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [savedAt, setSavedAt] = useState<string | null>(initialSavedAt);
  const [saveError, setSaveError] = useState("");

  const handleSavedChange = (next: {
    saved: boolean;
    savedAt: string | null;
  }) => {
    setSaved(next.saved);
    setSavedAt(next.savedAt);
  };

  const title = pairing.literature_title || "Daily reading";
  const authorOrSourceLine =
    pairing.literature_author ||
    pairing.literature_source ||
    pairing.literature_work ||
    "Quiet Curation";
  const bodyText =
    pairing.literature_text?.trim() || "No reading text available.";
  const verseReference = formatVerseReference(pairing.verse);
  const verseText = getVerseText(pairing.verse);
  const showVerse = Boolean(verseReference && verseText);
  const rationale = pairing.rationale_short?.trim();
  const attribution = buildAttributionParts(pairing);

  const metaParts = [];
  if (pairing.pairing_date) {
    metaParts.push(
      `Date ${new Date(pairing.pairing_date).toLocaleDateString()}`,
    );
  }
  metaParts.push(`ID ${pairing.id}`);
  if (savedAt) {
    metaParts.push(`Saved ${new Date(savedAt).toLocaleString()}`);
  }

  return (
    <section className="readingContainer">
      <header className="readingHeader">
        <div className="readingHeaderInner">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="headerAction"
          >
            <BackIcon />
          </button>
          <SaveButton
            pairingId={pairing.id}
            saved={saved}
            savedAt={savedAt}
            onSavedChange={handleSavedChange}
            onError={setSaveError}
          />
        </div>
      </header>
      <div className="readingBody">
        <div className="readingContent">
          {showVerse ? (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4">
              <div className="text-xs font-semibold text-neutral-500 truncate">
                {verseReference}
              </div>
              <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed text-neutral-900">
                {verseText}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              <p>Verse unavailable right now.</p>
              <p className="text-xs text-neutral-500">
                Pull to refresh or try again.
              </p>
            </div>
          )}
          <h1 className="readingTitle">{title}</h1>
          <div className="readingMetaLine">{authorOrSourceLine}</div>
          <p className="readingText">{bodyText}</p>
          {rationale ? (
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3">
              <p className="text-[13px] font-semibold text-neutral-600">
                Why this pairing?
              </p>
              <p
                className="mt-1 text-sm text-neutral-600"
                style={CLAMP_4_STYLE}
              >
                {trimText(rationale)}
              </p>
            </div>
          ) : null}
          {attribution || verseReference ? (
            <div className="text-xs text-neutral-500">
              {attribution ? (
                <p>
                  &mdash;{" "}
                  {attribution.author ? (
                    <span>{attribution.author}</span>
                  ) : null}
                  {attribution.author && attribution.title ? ", " : null}
                  {attribution.title ? (
                    <em className="italic">{attribution.title}</em>
                  ) : null}
                </p>
              ) : null}
              {verseReference ? <p>{verseReference}</p> : null}
            </div>
          ) : null}
          {saveError ? (
            <p className="text-xs text-rose-500">{saveError}</p>
          ) : null}
          <div className="readingFootnote">{metaParts.join(" · ")}</div>
        </div>
      </div>
    </section>
  );
}
