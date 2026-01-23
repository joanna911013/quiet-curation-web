"use server";

import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { getSeoulDateString, getTodayPairing } from "@/lib/queries/getTodayPairing";
import { EMOTION_KEY_SET, EMOTION_MEMO_MAX_LENGTH } from "@/lib/emotion";
import { logError } from "@/lib/observability";

export type EmotionEventView = {
  primaryEmotion: string;
  memo: string | null;
  eventDate: string;
};

export type SaveEmotionResult =
  | { ok: true; event: EmotionEventView }
  | { ok: false; error: string };

type SaveEmotionInput = {
  primaryEmotion: string;
  memo?: string;
};

const isEmotionLoggingEnabled = () =>
  process.env.EMOTION_LOGGING_ENABLED === "true" ||
  process.env.NEXT_PUBLIC_EMOTION_LOGGING_ENABLED === "true";

const resolveLocaleFromHeaders = async () => {
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language")?.toLowerCase() ?? "";
  const primary = acceptLanguage.split(",")[0]?.trim() ?? "";
  if (primary.startsWith("ko")) {
    return "ko";
  }
  return "en";
};

export async function upsertEmotionEvent(
  input: SaveEmotionInput,
): Promise<SaveEmotionResult> {
  const requestId = randomUUID();
  if (!isEmotionLoggingEnabled()) {
    return { ok: false, error: "Emotion logging is currently disabled." };
  }

  const primaryEmotion = input.primaryEmotion?.trim();
  if (!primaryEmotion) {
    return { ok: false, error: "Select a primary emotion." };
  }

  if (!EMOTION_KEY_SET.has(primaryEmotion)) {
    return { ok: false, error: "Selected emotion is not supported." };
  }

  const memo = input.memo?.trim() ?? "";
  if (memo.length > EMOTION_MEMO_MAX_LENGTH) {
    return {
      ok: false,
      error: `Memo must be ${EMOTION_MEMO_MAX_LENGTH} characters or fewer.`,
    };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "You must be signed in to log emotions." };
  }

  const locale = await resolveLocaleFromHeaders();
  const { pairing } = await getTodayPairing(supabase, locale);
  const pairingId = pairing?.id ?? null;
  const curationId = pairing?.curation_id ?? null;

  const eventDate = getSeoulDateString();

  const { data, error } = await supabase
    .from("emotion_events")
    .upsert(
      {
        user_id: user.id,
        event_date: eventDate,
        emotion_primary: primaryEmotion,
        memo_short: memo.length > 0 ? memo : null,
        pairing_id: pairingId,
        curation_id: curationId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,event_date" },
    )
    .select("emotion_primary, memo_short, event_date")
    .maybeSingle();

  if (error) {
    logError(
      "emotion.save_failed",
      {
        request_id: requestId,
        route: "emotion",
        user_id: user.id,
        locale,
        pairing_id: pairingId,
        curation_id: curationId,
        emotion_primary: primaryEmotion,
        memo_len: memo.length,
        supabase_code: (error as { code?: string }).code ?? null,
      },
      error,
    );
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "Unable to save emotion right now." };
  }

  return {
    ok: true,
    event: {
      primaryEmotion: data.emotion_primary,
      memo: data.memo_short ?? null,
      eventDate: data.event_date,
    },
  };
}
