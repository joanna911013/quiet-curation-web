"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabaseServer";

type LogoutResult = {
  ok: boolean;
  error?: string;
};

export async function logout(): Promise<LogoutResult> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/saved");
  revalidatePath("/");

  return { ok: true };
}
