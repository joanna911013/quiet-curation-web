export type MarketingEvent =
  | "lp_view"
  | "lp_cta_click"
  | "sub_view"
  | "sub_cta_request_click"
  | "sub_cta_request_sent"
  | "sub_cta_request_error"
  | "lp_cta_subscribe_click"
  | "lp_cta_secondary_click";

export function trackEvent(event: MarketingEvent) {
  if (typeof window === "undefined") {
    return;
  }
  const analytics = (window as typeof window & { analytics?: { track?: (name: string) => void } })
    .analytics;
  if (analytics?.track) {
    analytics.track(event);
  }
}
