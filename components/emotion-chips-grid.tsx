"use client";

import React from "react";

type Emotion = {
  id: string;
  label: string;
};

type EmotionChipsGridProps = {
  emotions: Emotion[];
  selectedId?: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function EmotionChipsGrid({
  emotions,
  selectedId,
  onSelect,
  className,
}: EmotionChipsGridProps) {
  return (
    <div
      className={joinClassNames(
        "grid grid-cols-2 gap-2 sm:grid-cols-3",
        className,
      )}
      role="group"
      aria-label="Emotions"
    >
      {emotions.map((emotion) => {
        const isSelected = selectedId === emotion.id;

        return (
          <button
            key={emotion.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? null : emotion.id)}
            className={joinClassNames(
              "min-h-[44px] rounded-full border px-4 text-sm font-medium transition",
              isSelected
                ? "border-neutral-300 bg-neutral-100 text-neutral-800"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-700",
            )}
          >
            {emotion.label}
          </button>
        );
      })}
    </div>
  );
}
