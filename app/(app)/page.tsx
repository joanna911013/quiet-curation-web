"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ContentCard } from "@/components/content-card";
import { supabase } from "@/lib/supabaseClient";

type PairingSummary = {
  id: string;
  pairing_date: string;
  literature_text: string;
  literature_source: string | null;
  literature_author: string | null;
  literature_work: string | null;
  literature_title: string | null;
  rationale_short: string | null;
  locale: string;
};

export default function HomePage() {
  const router = useRouter();
  const [pairings, setPairings] = useState<PairingSummary[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPairings = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (!isActive) {
        return;
      }

      if (userError || !userData?.user?.id) {
        setErrorMessage("Please sign in again.");
        setIsLoading(false);
        return;
      }

      const resolvedUserId = userData.user.id;
      setUserId(resolvedUserId);

      const locale =
        typeof navigator !== "undefined" &&
        navigator.language?.toLowerCase().startsWith("ko")
          ? "ko"
          : "en";

      const pairingSelect =
        "id, pairing_date, literature_text, literature_source, literature_author, literature_work, literature_title, rationale_short, locale";

      let { data: pairingData, error: pairingError } = await supabase
        .from("pairings")
        .select(pairingSelect)
        .eq("status", "approved")
        .eq("locale", locale)
        .order("pairing_date", { ascending: false })
        .limit(6);

      if (!pairingError && (pairingData?.length ?? 0) === 0) {
        const fallback = await supabase
          .from("pairings")
          .select(pairingSelect)
          .eq("status", "approved")
          .order("pairing_date", { ascending: false })
          .limit(6);

        pairingData = fallback.data ?? [];
        pairingError = fallback.error ?? null;
      }

      if (!isActive) {
        return;
      }

      if (pairingError) {
        setErrorMessage("Unable to load readings.");
        setIsLoading(false);
        return;
      }

      const resolvedPairings = pairingData ?? [];
      setPairings(resolvedPairings);

      if (resolvedPairings.length > 0) {
        const { data: savedData, error: savedError } = await supabase
          .from("saved_items")
          .select("pairing_id")
          .eq("user_id", resolvedUserId)
          .in(
            "pairing_id",
            resolvedPairings.map((pairing) => pairing.id),
          );

        if (!isActive) {
          return;
        }

        if (savedError) {
          console.error("Unable to load saved items.", savedError);
          setSavedIds([]);
        } else {
          setSavedIds(savedData?.map((item) => item.pairing_id) ?? []);
        }
      } else {
        setSavedIds([]);
      }

      setIsLoading(false);
    };

    void fetchPairings();

    return () => {
      isActive = false;
    };
  }, []);

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

  const toggleSaved = async (pairingId: string) => {
    if (!userId) {
      setErrorMessage("Please sign in again.");
      return;
    }
    if (savingIds.includes(pairingId)) {
      return;
    }

    const nextSaved = !savedIds.includes(pairingId);

    setSavedIds((prev) =>
      nextSaved
        ? [...prev, pairingId]
        : prev.filter((item) => item !== pairingId),
    );
    setSavingIds((prev) => [...prev, pairingId]);

    if (nextSaved) {
      const { error } = await supabase.from("saved_items").upsert(
        {
          user_id: userId,
          pairing_id: pairingId,
        },
        {
          onConflict: "user_id,pairing_id",
          ignoreDuplicates: true,
        },
      );

      if (error) {
        console.error("Unable to save item.", error);
        setSavedIds((prev) => prev.filter((item) => item !== pairingId));
        setSavingIds((prev) => prev.filter((item) => item !== pairingId));
        return;
      }

      setSavingIds((prev) => prev.filter((item) => item !== pairingId));
      return;
    }

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("user_id", userId)
      .eq("pairing_id", pairingId);

    if (error) {
      console.error("Unable to remove saved item.", error);
      setSavedIds((prev) =>
        prev.includes(pairingId) ? prev : [...prev, pairingId],
      );
    }
    setSavingIds((prev) => prev.filter((item) => item !== pairingId));
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
        {pairings.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
            No readings yet. Check back soon.
          </div>
        ) : (
          pairings.map((item) => {
            const previewText = item.rationale_short?.trim()
              ? item.rationale_short
              : item.literature_text.split("\n").find(Boolean) ||
                "A quiet reading for today.";
            const sourceText =
              item.literature_source ||
              item.literature_author ||
              item.literature_work ||
              "Quiet Curation";
            const titleText = item.literature_title || "Daily pairing";

            return (
            <ContentCard
              key={item.id}
              title={titleText}
              preview={previewText}
              source={sourceText}
              saved={savedIds.includes(item.id)}
              onOpen={() => router.push(`/c/${item.id}`)}
              onToggleSave={() => toggleSaved(item.id)}
            />
            );
          })
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
