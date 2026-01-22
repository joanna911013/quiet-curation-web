import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { PairingEditor } from "../editor";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function PairingDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const pairingId = resolvedParams.id;

  if (!pairingId) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Pairing not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Check the pairing ID and try again.
        </p>
      </main>
    );
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You do not have access to this page.
        </p>
      </main>
    );
  }

  const { data: pairing, error } = await supabase
    .from("pairings")
    .select(
      "id, pairing_date, locale, status, verse_id, literature_author, literature_title, literature_source, literature_text, rationale_short, updated_at, created_at",
    )
    .eq("id", pairingId)
    .maybeSingle();

  if (error || !pairing) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Pairing not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Check the pairing ID and try again.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <PairingEditor initial={pairing} today={getSeoulDateString()} />
    </main>
  );
}

function getSeoulDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}
