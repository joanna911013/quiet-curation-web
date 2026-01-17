"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListItem } from "@/components/list-item";
import { IconButton } from "@/components/icon-button";

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

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function SavedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <IconButton
              ariaLabel="Back"
              icon={<BackIcon />}
              onClick={() => router.push("/")}
            />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Saved
            </p>
          </div>
          <h1 className="text-2xl font-semibold">Bookmarks</h1>
          <p className="text-sm text-neutral-500">
            Return to readings you want to keep close.
          </p>
        </header>

        <section className="flex flex-col divide-y divide-neutral-200/70">
          {savedItems.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              source={item.source}
              preview={item.preview}
              onOpen={() => router.push(`/detail/${item.id}`)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
