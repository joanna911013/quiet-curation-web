"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { EmotionChipsGrid } from "@/components/emotion-chips-grid";
import { MemoField } from "@/components/memo-field";

const emotions = [
  { id: "calm", label: "Calm" },
  { id: "focused", label: "Focused" },
  { id: "grateful", label: "Grateful" },
  { id: "tired", label: "Tired" },
  { id: "curious", label: "Curious" },
  { id: "heavy", label: "Heavy" },
];

export default function EmotionPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");

  const handleSave = () => {
    if (!selectedId) {
      return;
    }
    router.push(`/done?emotion=${encodeURIComponent(selectedId)}`);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Emotion
          </p>
          <h1 className="text-2xl font-semibold">How do you feel today?</h1>
          <p className="text-sm text-neutral-500">
            Choose one word that fits the mood.
          </p>
        </header>

        <EmotionChipsGrid
          emotions={emotions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <MemoField value={memo} onChange={setMemo} maxLength={120} />

        <Button onClick={handleSave} disabled={!selectedId}>
          Save
        </Button>
      </div>
    </main>
  );
}
