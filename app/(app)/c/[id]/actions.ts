"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabaseServer";

type SaveResult = {
  createdAt?: string | null;
  error?: string;
};

type UnsaveResult = {
  error?: string;
};

export async function savePairing(pairingId: string): Promise<SaveResult> {
  if (!pairingId) {
    return { error: "Missing pairing id." };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be signed in to save." };
  }

  const { data, error } = await supabase
    .from("saved_items")
    .upsert(
      {
        user_id: user.id,
        pairing_id: pairingId,
      },
      {
        onConflict: "user_id,pairing_id",
        ignoreDuplicates: true,
      },
    )
    .select("created_at")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  let createdAt = data?.created_at ?? null;

  if (!createdAt) {
    const { data: existing, error: existingError } = await supabase
      .from("saved_items")
      .select("created_at")
      .eq("user_id", user.id)
      .eq("pairing_id", pairingId)
      .maybeSingle();

    if (existingError) {
      return { error: existingError.message };
    }

    createdAt = existing?.created_at ?? null;
  }

  revalidatePath("/saved");
  revalidatePath(`/c/${pairingId}`);

  return { createdAt };
}

export async function unsavePairing(pairingId: string): Promise<UnsaveResult> {
  if (!pairingId) {
    return { error: "Missing pairing id." };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be signed in to save." };
  }

  const { error } = await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", user.id)
    .eq("pairing_id", pairingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/saved");
  revalidatePath(`/c/${pairingId}`);

  return {};
}
