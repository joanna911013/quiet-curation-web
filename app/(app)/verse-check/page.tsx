import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function VerseCheckPage() {
  const supabase = await createSupabaseServer(); // 너는 Promise 반환이라 await 유지
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("verses")
    .select("id, locale, translation, canonical_ref, book, chapter, verse")
    .limit(1);

  return (
    <main style={{ padding: 16 }}>
      <h1>Verses RLS check</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          {
            userId: user?.id ?? null,
            userErr: userErr?.message ?? null,
            rows: data ?? null,
            error: error?.message ?? null,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}
