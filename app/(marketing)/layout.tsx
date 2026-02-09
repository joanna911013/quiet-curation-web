import type { ReactNode, CSSProperties } from "react";
import Link from "next/link";
import { Source_Sans_3 } from "next/font/google";

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

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div
      style={marketingTheme}
      className={`${sourceSans.className} min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]`}
    >
      <header className="border-b border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/landing"
            className="text-xs uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface-variant)]"
          >
            Quiet Curation
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[var(--md-sys-color-on-surface-variant)]">
            <Link href="/landing" className="hover:text-[var(--md-sys-color-on-surface)]">
              Landing
            </Link>
            <Link href="/subscribe" className="hover:text-[var(--md-sys-color-on-surface)]">
              Subscribe
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
