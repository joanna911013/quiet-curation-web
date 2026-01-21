"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveButton } from "./save-button";

type PairingDetail = {
  id: string;
  pairing_date: string | null;
  literature_text: string | null;
  literature_source: string | null;
  literature_author: string | null;
  literature_work: string | null;
  literature_title: string | null;
};

type DetailViewProps = {
  pairing: PairingDetail;
  initialSaved: boolean;
  initialSavedAt: string | null;
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
          <h1 className="readingTitle">{title}</h1>
          <div className="readingMetaLine">{authorOrSourceLine}</div>
          <p className="readingText">{bodyText}</p>
          {saveError ? (
            <p className="text-xs text-rose-500">{saveError}</p>
          ) : null}
          <div className="readingFootnote">{metaParts.join(" · ")}</div>
        </div>
      </div>
    </section>
  );
}
