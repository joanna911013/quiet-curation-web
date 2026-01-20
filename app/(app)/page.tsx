"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ContentCard } from "@/components/content-card";

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

export default function HomePage() {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>(["2"]);

  const isLoading = false;
  const errorMessage = "";

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-8">
        <p className="text-sm text-neutral-500">Loading today...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-8">
        <p className="text-sm text-neutral-500">{errorMessage}</p>
      </main>
    );
  }

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 pb-8 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Today
        </p>
        <h1 className="text-2xl font-semibold">Quiet Curation</h1>
        <p className="text-sm text-neutral-500">
          A calm daily pairing to start the day.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        {mockContent.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
            No readings yet. Check back soon.
          </div>
        ) : (
          mockContent.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              preview={item.preview}
              source={item.source}
              saved={savedIds.includes(item.id)}
              onOpen={() => router.push(`/c/${item.id}`)}
              onToggleSave={() => toggleSaved(item.id)}
            />
          ))
        )}
      </section>

      <div className="mt-2 flex flex-col gap-3">
        <Button onClick={() => router.push("/emotion")}>Continue</Button>
        <button
          type="button"
          className="text-xs text-neutral-500 underline"
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
      </div>
    </main>
  );
}
