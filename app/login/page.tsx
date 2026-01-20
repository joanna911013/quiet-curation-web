"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasSession = window.localStorage.getItem("qc:authed") === "1";
    if (hasSession) {
      router.replace("/");
      return;
    }
    setIsReady(true);
  }, [router]);

  const handleContinue = () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    window.localStorage.setItem("qc:authed", "1");
    router.push("/");
  };

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-5 pb-16 pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-16 pt-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-neutral-500">
            Receive a calm daily reading in your inbox.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-neutral-500">Email</span>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className="h-11 rounded-xl border border-neutral-200 bg-transparent px-4 text-base outline-none focus:border-neutral-400"
          />
        </label>

        <Button onClick={handleContinue} disabled={!email}>
          Send magic link
        </Button>

        {error ? (
          <p className="text-xs text-rose-500">{error}</p>
        ) : (
          <p className="text-xs text-neutral-400">
            Enter an email to continue.
          </p>
        )}

        <p className="text-xs text-neutral-400">
          This MVP uses mock auth only.
        </p>
      </div>
    </main>
  );
}
