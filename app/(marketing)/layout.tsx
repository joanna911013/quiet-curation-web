import type { ReactNode } from "react";
import Link from "next/link";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/landing"
            className="text-xs uppercase tracking-[0.2em] text-neutral-500"
          >
            Quiet Curation
          </Link>
          <nav className="flex items-center gap-4 text-sm text-neutral-500">
            <Link href="/landing" className="hover:text-neutral-700">
              Landing
            </Link>
            <Link href="/subscribe" className="hover:text-neutral-700">
              Subscribe
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
