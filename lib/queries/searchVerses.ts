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

  return client.rpc("search_verses", {
    query_text: queryText,
    locale,
    translation,
    top_k: topK,
  });
}
