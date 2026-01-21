"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";

type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function listSaved(): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("saved_items")
    .select("user_id, pairing_id, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

export async function normalSave(pairingId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("saved_items")
    .upsert(
      { user_id: user.id, pairing_id: pairingId },
      { onConflict: "user_id,pairing_id" }
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * 핵심 테스트: 로그인은 User B인데,
 * payload의 user_id를 User A로 넣어 저장 시도 -> RLS로 실패해야 정상
 */
export async function spoofSave(targetUserId: string, pairingId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("saved_items")
    .insert({ user_id: targetUserId, pairing_id: pairingId });

  // 기대: 여기서 RLS 에러가 나야 정상
  if (error) {
    return {
      ok: false,
      error: `[Expected if targetUserId != auth.uid()] ${error.message}`,
    };
  }

  // 만약 성공했다면 RLS가 깨진 것
  return {
    ok: true,
    data: {
      warning: "Spoof insert succeeded (THIS IS BAD). RLS/policies likely incorrect.",
      authedUserId: user.id,
      targetUserId,
      pairingId,
    },
  };
}

export async function normalUnsave(pairingId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, error: "Not authenticated" };

  const { error, count } = await supabase
    .from("saved_items")
    .delete({ count: "exact" })
    .eq("user_id", user.id)
    .eq("pairing_id", pairingId);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { deleted: count ?? 0 } };
}

export async function spoofUnsave(targetUserId: string, pairingId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return { ok: false, error: "Not authenticated" };

  const { error, count } = await supabase
    .from("saved_items")
    .delete({ count: "exact" })
    .eq("user_id", targetUserId)
    .eq("pairing_id", pairingId);

  // 기대: RLS 에러 or 삭제 0건이어야 정상
  if (error) {
    return {
      ok: false,
      error: `[Expected if targetUserId != auth.uid()] ${error.message}`,
    };
  }

  return { ok: true, data: { deleted: count ?? 0, authedUserId: user.id, targetUserId } };
}
