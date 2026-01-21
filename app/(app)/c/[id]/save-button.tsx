"use client";

import { useState } from "react";
import { IconButton } from "@/components/icon-button";
import { savePairing, unsavePairing } from "./actions";

type SaveButtonProps = {
  pairingId: string;
  saved: boolean;
  savedAt: string | null;
  onSavedChange: (next: { saved: boolean; savedAt: string | null }) => void;
  onError?: (message: string) => void;
};

export function SaveButton({
  pairingId,
  saved,
  savedAt,
  onSavedChange,
  onError,
}: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async () => {
    if (isSaving) {
      return;
    }

    const nextSaved = !saved;
    const previousSaved = saved;
    const previousSavedAt = savedAt;

    onSavedChange({
      saved: nextSaved,
      savedAt: nextSaved ? new Date().toISOString() : null,
    });
    onError?.("");
    setIsSaving(true);

    try {
      const result = nextSaved
        ? await savePairing(pairingId)
        : await unsavePairing(pairingId);

      if (result?.error) {
        onSavedChange({ saved: previousSaved, savedAt: previousSavedAt });
        onError?.("Unable to update saved state.");
        console.error("Save toggle failed.", result.error);
        return;
      }

      if (nextSaved && "createdAt" in result) {
        const createdAtValue = (result as { createdAt?: unknown }).createdAt;
        onSavedChange({
          saved: true,
          savedAt:
            typeof createdAtValue === "string"
              ? createdAtValue
              : previousSavedAt ?? new Date().toISOString(),
        });
      }
    } catch (error) {
      onSavedChange({ saved: previousSaved, savedAt: previousSavedAt });
      onError?.("Unable to update saved state.");
      console.error("Save toggle failed.", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <IconButton
      ariaLabel={saved ? "Remove bookmark" : "Save"}
      isActive={saved}
      ariaPressed={saved}
      onClick={handleToggle}
      disabled={isSaving}
    />
  );
}
