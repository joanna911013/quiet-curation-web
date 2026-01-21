import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Profile
        </p>
        <h1 className="text-2xl font-semibold">Account</h1>
      </header>

      <section className="flex flex-col gap-4">
        <div className="rounded-2xl border border-neutral-200/80 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Email
          </p>
          <p className="mt-2 text-base font-medium">
            {user.email ?? "Unknown"}
          </p>
          <p className="mt-3 text-xs text-neutral-400">
            User ID: {user.id}
          </p>
        </div>

        <LogoutButton />
      </section>
    </main>
  );
}
