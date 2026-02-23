import { createSupabaseServer } from "@/lib/supabaseServer";

type SearchVersesParams = {
  queryText: string;
  locale?: string;
  translation?: string;
  topK?: number;
  supabase?: Awaited<ReturnType<typeof createSupabaseServer>>;
};

export async function searchVerses({
  queryText,
  locale = "en",
  translation = "NIV",
  topK = 5,
  supabase,
}: SearchVersesParams) {
  const client = supabase ?? (await createSupabaseServer());

  const rpcResult = await client.rpc("search_verses", {
    query_text: queryText,
    locale,
    translation,
    top_k: topK,
  });

  if (!rpcResult.error) {
    return rpcResult;
  }

  // Graceful fallback when the DB RPC is out of sync with the current schema.
  const fallbackResult = await fallbackSearchVerses({
    queryText,
    locale,
    translation,
    topK,
    client,
  });

  if (!fallbackResult.error) {
    return fallbackResult;
  }

  return rpcResult;
}

type FallbackVerseRow = {
  id: string;
  canonical_ref: string | null;
  book: string | null;
  chapter: number | null;
  verse: number | null;
  verse_text: string | null;
};

type FallbackSearchResultRow = {
  verse_id: string;
  canonical_ref: string;
  score: number;
};

type FallbackSearchParams = {
  queryText: string;
  locale: string;
  translation: string;
  topK: number;
  client: Awaited<ReturnType<typeof createSupabaseServer>>;
};

async function fallbackSearchVerses({
  queryText,
  locale,
  translation,
  topK,
  client,
}: FallbackSearchParams) {
  const trimmedQuery = queryText.trim();
  if (!trimmedQuery) {
    return { data: [] as FallbackSearchResultRow[], error: null };
  }

  const topLimit = Math.max(topK, 1);
  const queryForLike = `%${trimmedQuery}%`;
  const lowerQuery = trimmedQuery.toLowerCase();
  const shortPrefix = lowerQuery.slice(0, 4);

  const [textMatch, refMatch] = await Promise.all([
    client
      .from("verses")
      .select("id, canonical_ref, book, chapter, verse, verse_text")
      .eq("locale", locale)
      .eq("translation", translation)
      .ilike("verse_text", queryForLike)
      .limit(topLimit * 3),
    client
      .from("verses")
      .select("id, canonical_ref, book, chapter, verse, verse_text")
      .eq("locale", locale)
      .eq("translation", translation)
      .ilike("canonical_ref", queryForLike)
      .limit(topLimit * 3),
  ]);

  if (textMatch.error && refMatch.error) {
    return { data: null, error: textMatch.error };
  }

  const mergedRows = new Map<string, FallbackVerseRow>();
  for (const row of (textMatch.data ?? []) as FallbackVerseRow[]) {
    mergedRows.set(row.id, row);
  }
  for (const row of (refMatch.data ?? []) as FallbackVerseRow[]) {
    mergedRows.set(row.id, row);
  }

  const scoredRows = [...mergedRows.values()]
    .map((row) => {
      const canonicalRef = formatReference(row);
      const body = (row.verse_text ?? "").toLowerCase();
      const canonicalLower = canonicalRef.toLowerCase();

      let score = 0;
      if (body.includes(lowerQuery)) {
        score = Math.max(score, 0.8);
      }
      if (canonicalLower.includes(lowerQuery)) {
        score = Math.max(score, 0.6);
      }
      if (lowerQuery.length >= 4 && body.includes(shortPrefix)) {
        score = Math.max(score, 0.3);
      }

      return {
        verse_id: row.id,
        canonical_ref: canonicalRef,
        score,
      } as FallbackSearchResultRow;
    })
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topLimit);

  return { data: scoredRows, error: null };
}

function formatReference(row: FallbackVerseRow) {
  const canonicalRef = row.canonical_ref?.trim();
  if (canonicalRef) {
    return canonicalRef;
  }
  if (row.book && row.chapter != null && row.verse != null) {
    return `${row.book} ${row.chapter}:${row.verse}`;
  }
  return "Unknown reference";
}
