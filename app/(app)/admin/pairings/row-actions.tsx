"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approvePairing, unapprovePairing } from "../actions";

type PairingRowActionsProps = {
  pairingId: string;
  status: string | null;
};

export function PairingRowActions({
  pairingId,
  status,
}: PairingRowActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (
    action: () => Promise<{ ok: boolean; error?: string; errors?: string[] }>,
  ) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.errors?.join(" ") || result.error || "Action failed.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2 text-xs text-neutral-500">
      {status === "approved" ? (
        <button
          type="button"
          onClick={() => handleAction(() => unapprovePairing(pairingId))}
          disabled={isPending}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700"
        >
          Set draft
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
      {error ? <span className="text-[11px] text-rose-500">{error}</span> : null}
    </div>
  );
}
