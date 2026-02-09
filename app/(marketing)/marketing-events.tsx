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
};

export function MarketingCtaLink({
  href,
  event,
  children,
}: MarketingCtaLinkProps) {
  const className = useMemo(
    () =>
      "inline-flex w-fit items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white",
    [],
  );

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
