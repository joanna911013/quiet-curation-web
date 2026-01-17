"use client";

import React from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  disabled = false,
  onClick,
  children,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={joinClassNames(
        "button",
        variant === "ghost" ? "buttonGhost" : "buttonPrimary",
        disabled ? "buttonDisabled" : undefined,
        className,
      )}
    >
      {children}
    </button>
  );
}
