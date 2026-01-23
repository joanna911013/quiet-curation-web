import { createSupabaseServer } from "@/lib/supabaseServer";
import { getSeoulDateString } from "@/lib/queries/getTodayPairing";
import {
  EMOTION_MEMO_MAX_LENGTH,
  EMOTION_TAXONOMY,
} from "@/lib/emotion";
import { EmotionPageClient } from "./emotion-client";

export const dynamic = "force-dynamic";

const isEmotionLoggingEnabled =
  process.env.EMOTION_LOGGING_ENABLED === "true" ||
  process.env.NEXT_PUBLIC_EMOTION_LOGGING_ENABLED === "true";

export default async function EmotionPage() {
  if (!isEmotionLoggingEnabled) {
    return (
      <EmotionPageClient
        enabled={false}
        emotions={EMOTION_TAXONOMY}
        memoMaxLength={EMOTION_MEMO_MAX_LENGTH}
        initialEvent={null}
      />
    );
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = getSeoulDateString();
  const { data, error } = await supabase
    .from("emotion_events")
    .select("emotion_primary, memo_short, event_date")
    .eq("user_id", user?.id ?? "")
    .eq("event_date", today)
    .maybeSingle();

  const initialEvent = data
    ? ({
        primaryEmotion: data.emotion_primary,
        memo: data.memo_short ?? null,
        eventDate: data.event_date,
      } as const)
    : null;

  const loadError = error ? "Unable to check today’s log." : null;

  return (
    <EmotionPageClient
      enabled
      emotions={EMOTION_TAXONOMY}
      memoMaxLength={EMOTION_MEMO_MAX_LENGTH}
      initialEvent={initialEvent}
      loadError={loadError}
    />
  );
}
