"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approvePairing,
  setTodayPairing,
  unapprovePairing,
} from "./actions";

type AdminRowActionsProps = {
  pairingId: string;
  locale: string;
  status: string | null;
};

export function AdminRowActions({
  pairingId,
  locale,
  status,
}: AdminRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAction = (action: () => Promise<{ ok: boolean; error?: string; errors?: string[] }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        const message =
          result.errors?.join(" ") || result.error || "Action failed.";
        setError(message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2 text-xs text-neutral-500">
      <div className="flex flex-wrap gap-2">
        {status === "approved" ? (
          <button
            type="button"
            onClick={() => handleAction(() => unapprovePairing(pairingId))}
            disabled={isPending}
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
          >
            Unapprove
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleAction(() => approvePairing(pairingId))}
            disabled={isPending}
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
          >
            Approve
          </button>
        )}
        <button
          type="button"
          onClick={() => handleAction(() => setTodayPairing(pairingId, locale))}
          disabled={isPending}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
        >
          Set as Today
        </button>
      </div>
      {error ? <span className="text-[11px] text-rose-500">{error}</span> : null}
    </div>
  );
}
