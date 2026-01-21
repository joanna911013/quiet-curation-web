import Link from "next/link";
import { redirect } from "next/navigation";
import { SavedListItem } from "@/components/saved-list-item";
import { RetryButton } from "@/components/retry-button";
import { createSupabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type SavedRow = {
  pairing_id: string;
  created_at: string;
};

type PairingRow = {
  id: string;
  pairing_date: string;
  locale: string;
  rationale_short: string | null;
  literature_text: string;
  literature_source: string | null;
  literature_author: string | null;
  literature_title: string | null;
  literature_work: string | null;
  verse_id: string;
};

type VerseRow = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  translation: string | null;
  canonical_ref: string | null;
  verse_text: string;
  text: string;
};

const trimText = (text: string) => text.replace(/\s+/g, " ").trim();

const truncateText = (text: string, max = 160) => {
  const cleaned = trimText(text);
  if (cleaned.length <= max) {
    return cleaned;
  }
  return `${cleaned.slice(0, max).trimEnd()}...`;
};

const formatVerseReference = (verse?: VerseRow | null) => {
  if (!verse) {
    return "Verse unavailable";
  }
  const canonical = verse.canonical_ref?.trim();
  const base = canonical
    ? canonical
    : `${verse.book} ${verse.chapter}:${verse.verse}`;
  const translation = verse.translation ? ` (${verse.translation})` : "";
  return `${base}${translation}`;
};

const formatSavedAt = (timestamp: string) =>
  new Date(timestamp).toLocaleString();

const buildLiteratureLine = (pairing: PairingRow) => {
  if (pairing.rationale_short?.trim()) {
    return truncateText(pairing.rationale_short, 140);
  }
  if (pairing.literature_text?.trim()) {
    return truncateText(pairing.literature_text, 140);
  }
  return "";
};

export default async function SavedPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: savedRows, error: savedError } = await supabase
    .from("saved_items")
    .select("pairing_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (savedError) {
    console.error("Failed to load saved items.", savedError);
  }

  const savedItems = (savedRows ?? []) as SavedRow[];

  if (savedError) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">
          Unable to load saved items right now.
        </p>
        <RetryButton className="mt-4" />
      </main>
    );
  }

  let savedListItems: Array<{
    id: string;
    title: string;
    sourceLine: string;
    verseText: string;
    literatureLine?: string;
    savedAt?: string;
  }> = [];

  if (savedItems.length > 0) {
    const pairingIds = savedItems.map((item) => item.pairing_id);

    const { data: pairingRows, error: pairingError } = await supabase
      .from("pairings")
      .select(
        "id, pairing_date, locale, rationale_short, literature_text, literature_source, literature_author, literature_title, literature_work, verse_id",
      )
      .eq("status", "approved")
      .in("id", pairingIds);

    if (pairingError) {
      console.error("Failed to load saved pairings.", pairingError);
      return (
        <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
          <p className="text-sm text-neutral-500">
            Unable to load saved items right now.
          </p>
          <RetryButton className="mt-4" />
        </main>
      );
    }

    const pairings = (pairingRows ?? []) as PairingRow[];
    const pairingsById = new Map(pairings.map((pairing) => [pairing.id, pairing]));

    const verseIds = pairings
      .map((pairing) => pairing.verse_id)
      .filter(Boolean);

    let versesById = new Map<string, VerseRow>();

    if (verseIds.length > 0) {
      const { data: verseRows, error: verseError } = await supabase
        .from("verses")
        .select(
          "id, book, chapter, verse, translation, canonical_ref, verse_text, text",
        )
        .in("id", verseIds);

      if (verseError) {
        console.error("Failed to load verses for saved items.", verseError);
        return (
          <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
            <p className="text-sm text-neutral-500">
              Unable to load saved items right now.
            </p>
            <RetryButton className="mt-4" />
          </main>
        );
      }

      const verses = (verseRows ?? []) as VerseRow[];
      versesById = new Map(verses.map((verse) => [verse.id, verse]));
    }

    savedListItems = savedItems
      .map((savedItem) => {
        const pairing = pairingsById.get(savedItem.pairing_id);
        if (!pairing) {
          return null;
        }
        const verse = versesById.get(pairing.verse_id);
        const verseReference = formatVerseReference(verse);
        const resolvedVerseText =
          verse?.verse_text?.trim() || verse?.text?.trim() || "";
        const verseText = resolvedVerseText
          ? truncateText(resolvedVerseText, 160)
          : "Verse text unavailable.";
        const literatureLine = buildLiteratureLine(pairing);
        const pairingTitle =
          pairing.literature_title ||
          pairing.literature_work ||
          "Daily pairing";
        const pairingSource =
          pairing.literature_author ||
          pairing.literature_source ||
          "Quiet Curation";
        const sourceLine = pairingSource
          ? `${pairingSource} · ${verseReference}`
          : verseReference;

        return {
          id: pairing.id,
          title: pairingTitle,
          sourceLine,
          verseText,
          literatureLine: literatureLine || undefined,
          savedAt: savedItem.created_at
            ? formatSavedAt(savedItem.created_at)
            : undefined,
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          title: string;
          sourceLine: string;
          verseText: string;
          literatureLine?: string;
          savedAt?: string;
        } => Boolean(item),
      );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Saved
        </p>
        <h1 className="text-2xl font-semibold">Bookmarks</h1>
        <p className="text-sm text-neutral-500">
          Return to readings you want to keep close.
        </p>
      </header>

      <section className="flex flex-col divide-y divide-neutral-200/70">
        {savedItems.length === 0 || savedListItems.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
            <p>No saved items yet.</p>
            <p className="mt-2 text-xs text-neutral-400">
              Open a pairing and tap Save.
            </p>
            <Link
              href="/"
              className="button buttonPrimary mt-4 inline-flex items-center justify-center"
            >
              Go to Today
            </Link>
          </div>
        ) : (
          savedListItems.map((item) => (
            <SavedListItem
              key={item.id}
              href={`/c/${item.id}`}
              title={item.title}
              sourceLine={item.sourceLine}
              verseText={item.verseText}
              literatureLine={item.literatureLine}
              savedAt={item.savedAt}
            />
          ))
        )}
      </section>
    </main>
  );
}
