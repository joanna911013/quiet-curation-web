import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { PairingEditor } from "../editor";

export default async function NewPairingPage() {
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

  const today = getSeoulDateString();

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <PairingEditor
        today={today}
        initial={{
          id: null,
          pairing_date: today,
          locale: "en",
          status: "draft",
          verse_id: "",
          curation_id: "",
          literature_author: "",
          literature_title: "",
          pub_year: "",
          literature_source: "",
          literature_text: "",
          explanations: "",
          rationale: "",
        }}
      />
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
