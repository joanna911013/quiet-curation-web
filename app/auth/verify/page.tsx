import { Suspense } from "react";

import VerifyClient from "./verify-client";

export default function AuthVerifyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-md flex-col gap-2 px-5 pb-16 pt-10">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Quiet Curation
            </p>
            <p className="text-sm text-neutral-500">Signing you in...</p>
          </div>
        }
      >
        <VerifyClient />
      </Suspense>
    </main>
  );
}
