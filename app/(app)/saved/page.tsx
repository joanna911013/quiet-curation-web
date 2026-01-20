"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListItem } from "@/components/list-item";

const savedItems = [
  {
    id: "2",
    title: "Weather for Interior Rooms",
    source: "Signal & Silence",
    preview: "Notice the weather inside you before the day begins.",
  },
  {
    id: "3",
    title: "A Few Lines Before Noon",
    source: "An Index of Small Things",
    preview: "A poem about attention, stillness, and small rituals.",
  },
];

export default function SavedPage() {
  const router = useRouter();
  const isLoading = false;
  const errorMessage = "";

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Loading saved items...</p>
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

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Saved
        </p>
        <h1 className="text-2xl font-semibold">Bookmarks</h1>
        <p className="text-sm text-neutral-500">
          Return to readings you want to keep close.
        </p>
      </header>

      <section className="flex flex-col divide-y divide-neutral-200/70">
        {savedItems.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
            No bookmarks yet.
          </div>
        ) : (
          savedItems.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              source={item.source}
              preview={item.preview}
              onOpen={() => router.push(`/c/${item.id}`)}
            />
          ))
        )}
      </section>
    </main>
  );
}
