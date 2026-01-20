"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";

export default function DonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams.get("emotion");
  const isLoading = false;
  const errorMessage = "";

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Loading...</p>
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
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Done
        </p>
        <h1 className="text-2xl font-semibold">Saved for today.</h1>
        <p className="text-sm text-neutral-500">
          {emotion ? `Emotion: ${emotion}` : "Thanks for checking in."}
        </p>
      </header>

      <Button onClick={() => router.push("/")}>Done</Button>
    </main>
  );
}
