import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import SavedRlsClient from "./client";

export default async function SavedRlsCheckPage() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  return (
    <main style={{ padding: 16, maxWidth: 720 }}>
      <h1>Saved RLS Check</h1>
      <p style={{ fontSize: 12, opacity: 0.75 }}>
        Logged in userId: <code>{user.id}</code>
      </p>

      <SavedRlsClient loggedInUserId={user.id} />
    </main>
  );
}
