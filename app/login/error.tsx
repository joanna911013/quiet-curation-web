"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-5 pb-16 pt-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Quiet Curation
          </p>
          <h1 className="text-lg font-semibold">Something went wrong.</h1>
          <p className="text-sm text-neutral-500">{error.message}</p>
        </div>
        <button type="button" className="button buttonGhost" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
