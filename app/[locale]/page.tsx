"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import { ContentCard } from "@/components/content-card";
import { IconButton } from "@/components/icon-button";

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

function SettingsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2.1 2.1 0 1 1-2.97 2.97l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2.1 2.1 0 1 1-4.2 0v-.07a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.1 2.1 0 1 1-2.97-2.97l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2.1 2.1 0 1 1 0-4.2h.04A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.1 2.1 0 1 1 2.97-2.97l.06.06A1.7 1.7 0 0 0 8 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2.1 2.1 0 1 1 4.2 0v.04A1.7 1.7 0 0 0 14 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2.1 2.1 0 1 1 2.97 2.97l-.06.06A1.7 1.7 0 0 0 19.4 8a1.7 1.7 0 0 0 1.56 1.03H21a2.1 2.1 0 1 1 0 4.2h-.04A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const t = useTranslations("home");
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(["2"]);

  useEffect(() => {
    const hasSession = window.localStorage.getItem("qc:authed") === "1";
    if (!hasSession) {
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
    setIsReady(true);
  }, [router]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (!isReady || !isAuthed) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 pb-6 pt-8">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              {t("today")}
            </p>
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <p className="text-sm text-neutral-500">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              ariaLabel="Saved"
              isActive={false}
              onClick={() => router.push("/saved")}
            />
            <IconButton
              ariaLabel="Settings"
              icon={<SettingsIcon />}
              onClick={() => router.push("/settings")}
            />
          </div>
        </header>

        <section className="flex flex-col gap-4">
          {mockContent.map((item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              preview={item.preview}
              source={item.source}
              saved={savedIds.includes(item.id)}
              onOpen={() => router.push(`/detail/${item.id}`)}
              onToggleSave={() => toggleSaved(item.id)}
            />
          ))}
        </section>
      </div>
      <div className="sticky bottom-0 w-full bg-[var(--background)]">
        <div className="mx-auto w-full max-w-xl px-5 pb-8 pt-2">
          <Button onClick={() => router.push("/emotion")}>Continue</Button>
        </div>
      </div>
    </main>
  );
}
