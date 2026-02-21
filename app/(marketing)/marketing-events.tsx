"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { trackEvent, type MarketingEvent } from "@/lib/analytics";

type MarketingViewEventProps = {
  event: MarketingEvent;
};

export function MarketingViewEvent({ event }: MarketingViewEventProps) {
  useEffect(() => {
    trackEvent(event);
  }, [event]);

  return null;
}

type MarketingCtaLinkProps = {
  href: string;
  event: MarketingEvent;
  children: ReactNode;
  className?: string;
};

export function MarketingCtaLink({
  href,
  event,
  children,
  className,
}: MarketingCtaLinkProps) {
  const baseClassName = useMemo(
    () =>
      "inline-flex w-fit items-center rounded-[20px] bg-[var(--md-sys-color-primary)] px-6 py-3 text-sm font-medium text-[var(--md-sys-color-on-primary)] min-h-[44px] shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition hover:brightness-95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]",
    [],
  );

  return (
    <Link
      href={href}
      className={`${baseClassName} ${className ?? ""}`.trim()}
      onClick={() => trackEvent(event)}
    >
      {children}
    </Link>
  );
}

type MarketingTextLinkProps = {
  href: string;
  event: MarketingEvent;
  children: ReactNode;
  className?: string;
};

export function MarketingTextLink({
  href,
  event,
  children,
  className,
}: MarketingTextLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(event)}
    >
      {children}
    </Link>
  );
}

type MarketingCtaButtonProps = {
  event: MarketingEvent;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function MarketingCtaButton({
  event,
  children,
  className,
  type = "button",
}: MarketingCtaButtonProps) {
  return (
    <button
      type={type}
      className={className}
      onClick={() => trackEvent(event)}
    >
      {children}
    </button>
  );
}
