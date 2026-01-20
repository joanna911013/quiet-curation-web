"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/saved", label: "Saved" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const hasSession = window.localStorage.getItem("qc:authed") === "1";
    if (!hasSession) {
      setIsReady(true);
      router.replace("/login");
      return;
    }
    setIsAuthed(true);
    setIsReady(true);
  }, [router]);

  if (!isReady || !isAuthed) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-5 pb-10 pt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-neutral-500"
          >
            Quiet Curation
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "font-semibold text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-700"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
