"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { EmotionChipsGrid } from "@/components/emotion-chips-grid";
import { MemoField } from "@/components/memo-field";
import { type EmotionOption } from "@/lib/emotion";
import { upsertEmotionEvent, type EmotionEventView } from "./actions";

type EmotionPageClientProps = {
  enabled: boolean;
  emotions: EmotionOption[];
  memoMaxLength: number;
  initialEvent: EmotionEventView | null;
  loadError?: string | null;
};

export function EmotionPageClient({
  enabled,
  emotions,
  memoMaxLength,
  initialEvent,
  loadError,
}: EmotionPageClientProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialEvent?.primaryEmotion ?? null,
  );
  const selectedEmotion = selectedId
    ? emotions.find((emotion) => emotion.id === selectedId) ?? null
    : null;
  const [memo, setMemo] = useState(initialEvent?.memo ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loggedEvent, setLoggedEvent] = useState<EmotionEventView | null>(
    initialEvent,
  );

  const handleSave = async () => {
    if (!selectedId || isSaving) {
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    const result = await upsertEmotionEvent({
      primaryEmotion: selectedId,
      memo,
    });
    setIsSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setSelectedId(result.event.primaryEmotion);
    setMemo(result.event.memo ?? "");
    setLoggedEvent(result.event);
  };

  if (!enabled) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-8">
        <p className="text-sm text-neutral-500">
          Emotion logging is currently disabled.
        </p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to Today
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Emotion
        </p>
        <h1 className="text-2xl font-semibold">How do you feel today?</h1>
        <p className="text-sm text-neutral-500">
          Choose one word that fits the mood.
        </p>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          {loadError}
        </div>
      ) : null}

      {emotions.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
          No emotions available.
        </div>
      ) : (
        <EmotionChipsGrid
          emotions={emotions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}

      {selectedEmotion?.uiLine ? (
        <p className="text-base text-neutral-700">{selectedEmotion.uiLine}</p>
      ) : null}

      {selectedId ? (
        <MemoField value={memo} onChange={setMemo} maxLength={memoMaxLength} />
      ) : null}

      {loggedEvent ? (
        <p className="text-xs font-medium text-neutral-500">
          Logged for today
        </p>
      ) : null}

      {errorMessage ? (
        <div className="text-xs text-neutral-500">
          <span>{errorMessage}</span>
          {selectedId ? (
            <button
              type="button"
              onClick={handleSave}
              className="ml-2 underline"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button onClick={handleSave} disabled={!selectedId || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Skip for now
        </Button>
      </div>
    </main>
  );
}
