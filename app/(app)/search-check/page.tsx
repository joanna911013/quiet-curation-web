import { createSupabaseServer } from "@/lib/supabaseServer";
import { searchVerses } from "@/lib/queries/searchVerses";

const QUERIES = ["shepherd", "rest", "anxiety"];
const LOCALE = "en";
const TRANSLATION = "NIV";
const TOP_K = 5;

export default async function SearchCheckPage() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  const results = await Promise.all(
    QUERIES.map(async (query) => {
      const { data, error } = await searchVerses({
        queryText: query,
        locale: LOCALE,
        translation: TRANSLATION,
        topK: TOP_K,
        supabase,
      });

      return {
        query,
        rows: data ?? null,
        error: error?.message ?? null,
      };
    }),
  );

  return (
    <main style={{ padding: 16 }}>
      <h1>Verse search check</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          {
            userId: user?.id ?? null,
            userErr: userErr?.message ?? null,
            locale: LOCALE,
            translation: TRANSLATION,
            results,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}
