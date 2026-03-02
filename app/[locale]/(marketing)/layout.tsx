import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-marketing",
});

const marketingTheme = {
  "--md-sys-color-primary": "#0b6b5a",
  "--md-sys-color-on-primary": "#ffffff",
  "--md-sys-color-secondary": "#4a635d",
  "--md-sys-color-surface": "#f8f6f4",
  "--md-sys-color-surface-container": "#efe9e6",
  "--md-sys-color-surface-container-high": "#e7e0dc",
  "--md-sys-color-outline": "#d2c7c1",
  "--md-sys-color-on-surface": "#1d1b1a",
  "--md-sys-color-on-surface-variant": "#4a4340",
} as CSSProperties;

type LocalizedMarketingLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocalizedMarketingLayout({
  children,
  params,
}: LocalizedMarketingLayoutProps) {
  const { locale } = await params;

  if (locale !== "ko" && locale !== "en") {
    notFound();
  }

  const basePath = locale === "ko" ? "/ko" : "";
  const navCopy =
    locale === "ko"
      ? { landing: "랜딩", subscribe: "구독" }
      : { landing: "Landing", subscribe: "Subscribe" };

  return (
    <div
      style={marketingTheme}
      className={`${sourceSans.className} min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]`}
    >
      <header className="border-b border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href={`${basePath}/landing`}
            className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]"
          >
            Quiet Curation
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[var(--md-sys-color-on-surface-variant)]">
            <Link
              href={`${basePath}/landing`}
              className="hover:text-[var(--md-sys-color-on-surface)]"
            >
              {navCopy.landing}
            </Link>
            <Link
              href={`${basePath}/subscribe`}
              className="hover:text-[var(--md-sys-color-on-surface)]"
            >
              {navCopy.subscribe}
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
