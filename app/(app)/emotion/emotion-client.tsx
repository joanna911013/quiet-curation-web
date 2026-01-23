"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { EmotionChipsGrid } from "@/components/emotion-chips-grid";
import { MemoField } from "@/components/memo-field";
import { resolveEmotionLabel, type EmotionOption } from "@/lib/emotion";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
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

    setLoggedEvent(result.event);
  };

  if (!enabled) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">
          Emotion logging is currently disabled.
        </p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to Today
        </Button>
      </main>
    );
  }

  if (loggedEvent) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Emotion
          </p>
          <h1 className="text-2xl font-semibold">Logged today.</h1>
          <p className="text-sm text-neutral-500">
            Your check-in is saved for {loggedEvent.eventDate}.
          </p>
        </header>

        <section className="rounded-2xl border border-neutral-200/80 bg-white p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Primary Emotion
          </div>
          <div className="mt-3 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-sm font-medium text-neutral-700">
            {resolveEmotionLabel(loggedEvent.primaryEmotion)}
          </div>
          {loggedEvent.memo ? (
            <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-600">
              {loggedEvent.memo}
            </p>
          ) : null}
        </section>

        <Button onClick={() => router.push("/")}>Back to Today</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
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

      {selectedId ? (
        <MemoField value={memo} onChange={setMemo} maxLength={memoMaxLength} />
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-rose-600">{errorMessage}</p>
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
