"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = () => {
    window.localStorage.removeItem("qc:authed");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-16 pt-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Settings
          </p>
          <h1 className="text-2xl font-semibold">Account</h1>
        </header>

        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-neutral-200/80 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Email
            </p>
            <p className="mt-2 text-base font-medium">user@example.com</p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80">
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span>Terms of Service</span>
              <span className="text-neutral-400">Coming soon</span>
            </div>
            <div className="h-px bg-neutral-200/80" />
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span>Privacy Policy</span>
              <span className="text-neutral-400">Coming soon</span>
            </div>
          </div>

          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>

          <p className="text-xs text-neutral-400">Version 1.0.0</p>
        </section>
      </div>
    </main>
  );
}
