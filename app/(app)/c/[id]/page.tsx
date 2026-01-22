import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { DetailView } from "./detail-view";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

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
  text: string | null;
  book: string | null;
  chapter: number | null;
  verse: number | null;
};

type PairingRow = Omit<PairingDetail, "verse"> & {
  verse_id: string | null;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function DetailPage({ params }: PageProps) {
  const { id: pairingId } = await params;
  if (!pairingId || !UUID_REGEX.test(pairingId)) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Reading not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex text-xs text-neutral-500 underline"
        >
          Back to Home
        </Link>
      </main>
    );
  }
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: pairing, error: pairingError } = await supabase
    .from("pairings")
    .select(
      "id, pairing_date, literature_text, literature_source, literature_author, literature_work, literature_title, rationale_short, verse_id",
    )
    .eq("status", "approved")
    .eq("id", pairingId)
    .maybeSingle();

  if (pairingError) {
    console.error("Failed to load pairing detail.", pairingError);
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Unable to load reading.</p>
        <Link
          href="/"
          className="mt-4 inline-flex text-xs text-neutral-500 underline"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  if (!pairing) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Reading not found.</p>
        <Link href="/" className="mt-4 inline-flex text-xs text-neutral-500 underline">
          Back to Home
        </Link>
      </main>
    );
  }

  const rawPairing = pairing as PairingRow;
  let verse: VerseRow | null = null;

  if (rawPairing.verse_id) {
    const { data: verseRow, error: verseError } = await supabase
      .from("verses")
      .select("id, translation, canonical_ref, verse_text, text, book, chapter, verse")
      .eq("id", rawPairing.verse_id)
      .maybeSingle();

    if (verseError) {
      console.error("Failed to load verse for pairing.", verseError);
    } else {
      verse = (verseRow as VerseRow) ?? null;
    }
  }

  const resolvedPairing = {
    ...rawPairing,
    verse,
  } as PairingDetail;

  const { data: savedRow, error: savedError } = await supabase
    .from("saved_items")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("pairing_id", pairingId)
    .maybeSingle();

  if (savedError) {
    console.error("Unable to load saved state.", savedError);
  }

  return (
    <DetailView
      pairing={resolvedPairing}
      initialSaved={Boolean(savedRow)}
      initialSavedAt={savedRow?.created_at ?? null}
    />
  );
}
