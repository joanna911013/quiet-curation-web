import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { PairingRowActions } from "./row-actions";

type PageProps = {
  searchParams?:
    | {
        date?: string;
        locale?: string;
        status?: string;
      }
    | Promise<{
        date?: string;
        locale?: string;
        status?: string;
      }>;
};

type PairingRow = {
  id: string;
  pairing_date: string | null;
  locale: string | null;
  status: string | null;
  verse_id?: string | null;
  curation_id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

export default async function PairingsAdminPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirect=/admin/pairings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You do not have access to this page.
        </p>
      </main>
    );
  }

  const today = getSeoulDateString();
  const dateFilter = resolvedSearchParams?.date ?? today;
  const localeFilter = resolvedSearchParams?.locale ?? "en";
  const statusFilter = normalizeStatus(resolvedSearchParams?.status);

  const { data, error, usesUpdatedAt } = await fetchPairings(
    supabase,
    dateFilter,
    localeFilter,
    statusFilter,
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pb-16 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold">Pairings</h1>
          <p className="text-sm text-neutral-500">
            Daily pairing operations for date and locale.
          </p>
        </div>
        <Link
          className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
          href="/admin/pairings/new"
        >
          New pairing
        </Link>
      </header>

      <form className="flex flex-wrap gap-3 text-sm text-neutral-600">
        <label className="flex flex-col gap-2">
          Date
          <input
            type="date"
            name="date"
            defaultValue={dateFilter}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2">
          Locale
          <input
            type="text"
            name="locale"
            defaultValue={localeFilter}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2">
          Status
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          >
            <option value="draft">draft</option>
            <option value="approved">approved</option>
            <option value="all">all</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-auto rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
        >
          Apply
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Unable to load pairings. {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-neutral-200/80">
        <div className="grid grid-cols-8 gap-3 border-b border-neutral-200/80 bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-500">
          <span>Date</span>
          <span>Locale</span>
          <span>Status</span>
          <span>{usesUpdatedAt ? "Updated" : "Created"}</span>
          <span>ID</span>
          <span>Verse</span>
          <span>Curation</span>
          <span>Actions</span>
        </div>

        {data?.length ? (
          data.map((pairing) => {
            const updatedValue = pairing.updated_at ?? pairing.created_at;
            const updatedLabel = updatedValue
              ? new Date(updatedValue).toLocaleString()
              : "—";
            return (
              <div
                key={pairing.id}
                className="grid grid-cols-8 gap-3 border-b border-neutral-200/60 px-4 py-4 text-sm text-neutral-700 last:border-b-0"
              >
                <span>
                  {pairing.pairing_date
                    ? new Date(pairing.pairing_date).toLocaleDateString()
                    : "—"}
                </span>
                <span>{pairing.locale ?? "—"}</span>
                <span className="capitalize">{pairing.status ?? "—"}</span>
                <span className="text-xs text-neutral-500">{updatedLabel}</span>
                <span className="text-xs text-neutral-500">
                  {pairing.id.slice(0, 8)}
                </span>
                <span className="text-xs text-neutral-500">
                  {pairing.verse_id ? pairing.verse_id.slice(0, 8) : "—"}
                </span>
                <span className="text-xs text-neutral-500">
                  {pairing.curation_id ? pairing.curation_id.slice(0, 8) : "—"}
                </span>
                <div className="flex flex-col gap-2">
                  <Link
                    className="text-xs text-neutral-600 underline"
                    href={`/admin/pairings/${pairing.id}`}
                  >
                    View/Edit
                  </Link>
                  <PairingRowActions
                    pairingId={pairing.id}
                    status={pairing.status}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-8 text-sm text-neutral-500">
            No pairings found for this filter.
          </div>
        )}
      </div>
    </main>
  );
}

function normalizeStatus(input?: string) {
  if (input === "approved" || input === "all") {
    return input;
  }
  return "draft";
}

async function fetchPairings(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  dateFilter: string,
  localeFilter: string,
  statusFilter: string,
) {
  const baseQuery = applyFilters(
    supabase
      .from("pairings")
      .select(
        "id, pairing_date, locale, status, verse_id, curation_id, updated_at, created_at",
      ),
    dateFilter,
    localeFilter,
    statusFilter,
  );

  const initialResult = await baseQuery
    .order("pairing_date", { ascending: false })
    .order("updated_at", { ascending: false });
  let data = initialResult.data as PairingRow[] | null;
  let error = initialResult.error;

  if (error?.message?.includes("updated_at")) {
    const fallbackQuery = applyFilters(
      supabase
        .from("pairings")
        .select("id, pairing_date, locale, status, verse_id, curation_id, created_at"),
      dateFilter,
      localeFilter,
      statusFilter,
    );
    const fallbackResult = await fallbackQuery
      .order("pairing_date", { ascending: false })
      .order("created_at", { ascending: false });
    data = fallbackResult.data as PairingRow[] | null;
    error = fallbackResult.error;
    return {
      data: data as PairingRow[] | null,
      error: error?.message ?? null,
      usesUpdatedAt: false,
    };
  }

  return {
    data: data as PairingRow[] | null,
    error: error?.message ?? null,
    usesUpdatedAt: true,
  };
}

function applyFilters<T>(
  query: T,
  dateFilter: string,
  localeFilter: string,
  statusFilter: string,
): T {
  let builder = query as unknown as FilterableQuery;
  builder = builder.eq("pairing_date", dateFilter).eq("locale", localeFilter);
  if (statusFilter !== "all") {
    builder = builder.eq("status", statusFilter);
  }
  return builder as unknown as T;
}

type FilterableQuery = {
  eq: (column: string, value: string) => FilterableQuery;
};

function getSeoulDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}
