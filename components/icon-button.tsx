"use client";

import React from "react";

type IconButtonProps = {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  size?: number;
  ariaPressed?: boolean;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

function BookmarkIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function IconButton({
  icon,
  children,
  ariaLabel,
  isActive = false,
  onClick,
  disabled = false,
  size,
  ariaPressed,
  className,
}: IconButtonProps) {
  const content = children ?? icon ?? <BookmarkIcon filled={isActive} />;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onClick={onClick}
      disabled={disabled || !onClick}
      className={joinClassNames(
        "iconButton",
        isActive ? "iconButtonActive" : "iconButtonInactive",
        className,
      )}
      style={
        size
          ? ({ "--icon-button-size": `${size}px` } as React.CSSProperties)
          : undefined
      }
    >
      {content}
    </button>
  );
}
