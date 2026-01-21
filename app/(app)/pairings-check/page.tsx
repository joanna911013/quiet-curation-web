import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function PairingsCheckPage() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("pairings")
    .select("id, pairing_date, locale, status, verse_id")
    .order("pairing_date", { ascending: false })
    .limit(20);

  const nonApproved =
    (data ?? []).filter((row) => row.status && row.status !== "approved");

  return (
    <main style={{ padding: 16 }}>
      <h1>Pairings RLS check</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          {
            userId: user?.id ?? null,
            userErr: userErr?.message ?? null,
            rows: data ?? null,
            nonApprovedSeen: nonApproved,
            error: error?.message ?? null,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}
