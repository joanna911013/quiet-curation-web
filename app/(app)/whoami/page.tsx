import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function WhoAmI() {
  const supabase = await createSupabaseServer(); // ✅ 여기 await
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 16 }}>
      <h1>Protected whoami</h1>
      <pre>{JSON.stringify({ userId: user?.id ?? null, email: user?.email ?? null, error }, null, 2)}</pre>
    </main>
  );
}
