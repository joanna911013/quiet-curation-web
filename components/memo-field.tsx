"use client";

import React from "react";

type MemoFieldProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function MemoField({
  value,
  onChange,
  maxLength,
  className,
}: MemoFieldProps) {
  return (
    <div className={joinClassNames("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
        <span>Optional</span>
        {typeof maxLength === "number" ? (
          <span className="normal-case tracking-normal text-neutral-400">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <textarea
        rows={3}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Leave a short note."
        className="min-h-[96px] w-full rounded-2xl border border-neutral-200 bg-transparent px-4 py-3 text-sm text-neutral-700 outline-none focus:border-neutral-400"
      />
    </div>
  );
}
