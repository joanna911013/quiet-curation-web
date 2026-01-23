import { createSupabaseServer } from "@/lib/supabaseServer";

export type VerseRow = {
  id: string;
  translation: string | null;
  canonical_ref: string | null;
  verse_text: string | null;
  book: string | null;
  chapter: number | null;
  verse: number | null;
};

export type TodayPairing = {
  id: string;
  pairing_date: string | null;
  locale: string | null;
  status: string | null;
  curation_id: string | null;
  literature_text: string | null;
  literature_source: string | null;
  literature_author: string | null;
  literature_title: string | null;
  literature_work: string | null;
  rationale_short: string | null;
  verse_id: string | null;
  created_at?: string | null;
  verse: VerseRow | null;
};

type PairingRow = Omit<TodayPairing, "verse">;

type PairingQueryResult = {
  row: PairingRow | null;
  error: string | null;
};

const PAIRING_SELECT =
  "id, pairing_date, locale, status, curation_id, literature_text, literature_source, literature_author, literature_title, literature_work, rationale_short, verse_id, created_at";

export async function getTodayPairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  locale: string,
) {
  const today = getSeoulDateString();

  const primaryResult = await fetchApprovedTodayPairing(supabase, today, locale);
  if (primaryResult.row) {
    const pairing = await hydratePairing(supabase, primaryResult.row);
    return { pairing, error: null, date: today, isFallback: false };
  }

  if (primaryResult.error) {
    console.error("[today] pairing lookup failed:", primaryResult.error);
  }

  const safeResult = await fetchSafeSetPairing(supabase, locale);
  if (safeResult.row) {
    const pairing = await hydratePairing(supabase, safeResult.row);
    return { pairing, error: null, date: today, isFallback: true };
  }

  if (safeResult.error) {
    console.error("[today] safe set lookup failed:", safeResult.error);
  }

  return {
    pairing: null,
    error: primaryResult.error ?? safeResult.error,
    date: today,
    isFallback: false,
  };
}

export function getSeoulDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

async function fetchApprovedTodayPairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  today: string,
  locale: string,
): Promise<PairingQueryResult> {
  const { data, error } = await supabase
    .from("pairings")
    .select(PAIRING_SELECT)
    .eq("status", "approved")
    .eq("pairing_date", today)
    .eq("locale", locale)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    return { row: null, error: error.message };
  }

  return { row: (data?.[0] as PairingRow) ?? null, error: null };
}

async function fetchSafeSetPairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  locale: string,
): Promise<PairingQueryResult> {
  const { data, error } = await supabase
    .from("pairings")
    .select(PAIRING_SELECT)
    .eq("status", "approved")
    .eq("locale", locale)
    .eq("is_safe_set", true)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    return { row: null, error: error.message };
  }

  return { row: (data?.[0] as PairingRow) ?? null, error: null };
}

async function hydratePairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  raw: PairingRow,
): Promise<TodayPairing> {
  let verse: VerseRow | null = null;

  if (raw.verse_id) {
    const { data: verseRow, error: verseError } = await supabase
      .from("verses")
      .select("id, translation, canonical_ref, verse_text, book, chapter, verse")
      .eq("id", raw.verse_id)
      .maybeSingle();

    if (verseError) {
      console.error("[today] verse lookup failed:", verseError.message);
    } else {
      verse = (verseRow as VerseRow) ?? null;
    }
  }

  return {
    ...raw,
    verse,
  } as TodayPairing;
}
