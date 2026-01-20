export default function AdminPage() {
  const isLoading = false;
  const errorMessage = "";

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">Loading admin...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <p className="text-sm text-neutral-500">{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-5 pb-16 pt-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Admin
        </p>
        <h1 className="text-2xl font-semibold">Admin console</h1>
      </header>
      <div className="rounded-2xl border border-neutral-200/80 p-5 text-sm text-neutral-500">
        Admin tools will land on Day 4. This is a stub route for now.
      </div>
    </main>
  );
}
