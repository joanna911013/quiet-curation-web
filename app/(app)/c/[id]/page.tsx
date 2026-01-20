"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ReadingContainer } from "@/components/reading-container";

const mockContent = [
  {
    id: "1",
    title: "The Slow Light",
    preview:
      "A short reflection on returning to the same sentence until it feels like home.",
    source: "Quiet Notes",
  },
  {
    id: "2",
    title: "Weather for Interior Rooms",
    preview:
      "A small practice for noticing the weather inside you before the day begins.",
    source: "Signal & Silence",
  },
  {
    id: "3",
    title: "A Few Lines Before Noon",
    preview: "A poem about attention, stillness, and small rituals.",
    source: "An Index of Small Things",
  },
];

const bodyText =
  "The day does not need to be explained. It asks only to be met, one sentence at a time.\n\n"
  +
  "Let the first line settle, then the next. This is not urgency, but a slow unfolding. "
  +
  "Return to the phrases that soften your shoulders. Let them become familiar.\n\n"
  +
  "When the room feels louder than it should, this is a place to pause. "
  +
  "Breathe until the edges of the page feel steady. You are allowed to begin again.";

export default function DetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const isLoading = false;
  const errorMessage = "";

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Loading reading...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">{errorMessage}</p>
      </main>
    );
  }

  const content = mockContent.find((item) => item.id === id);

  if (!content) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Reading not found.</p>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </main>
    );
  }

  return (
    <ReadingContainer
      title={content.title}
      authorOrSourceLine={content.source}
      meta={`Source: ${content.source} · ID ${content.id}`}
      body={bodyText}
      saved={saved}
      onToggleSave={() => setSaved((prev) => !prev)}
      onBack={() => router.back()}
    />
  );
}
