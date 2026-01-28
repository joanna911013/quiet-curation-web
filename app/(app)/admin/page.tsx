import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AdminRowActions } from "./admin-row-actions";

const DEFAULT_LOCALE = "en";

type AdminPageProps = {
  searchParams?:
    | {
        status?: string;
      }
    | Promise<{
        status?: string;
      }>;
};

type PairingRow = {
  id: string;
  pairing_date: string | null;
  locale: string | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load profile role:", profileError.message);
  }

  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Not authorized</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You do not have access to this page.
        </p>
      </main>
    );
  }

  const filter = (resolvedSearchParams?.status ?? "draft").toLowerCase();
  const today = getSeoulDateString();
  const warningLocale = DEFAULT_LOCALE;
  const { exists: hasTodayPairing } = await fetchTodayApprovedPairing(
    supabase,
    today,
    warningLocale,
  );
  const showWarning = !hasTodayPairing;
  const { data, error, usesUpdatedAt } = await fetchPairings(
    supabase,
    filter,
    today,
  );

  if (error) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Unable to load pairings. {error}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pb-16 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold">Pairings</h1>
          <p className="text-sm text-neutral-500">
            Manage daily pairings and approvals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
            href="/admin/pairings"
          >
            Pairings dashboard
          </Link>
          <Link
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
            href="/admin/pairings/new"
          >
            New pairing
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
        <FilterChip active={filter === "draft"} href="/admin?status=draft">
          Draft
        </FilterChip>
        <FilterChip active={filter === "approved"} href="/admin?status=approved">
          Approved
        </FilterChip>
        <FilterChip
          active={filter === "scheduled"}
          href="/admin?status=scheduled"
        >
          Scheduled
        </FilterChip>
      </div>

      {showWarning ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          <span>Today pairing missing</span>
          <Link
            href={`/admin/pairings?date=${today}&locale=${warningLocale}&status=all`}
            className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600 underline"
          >
            Review today
          </Link>
        </div>
      ) : null}

      <div className="rounded-2xl border border-neutral-200/80">
        <div className="grid grid-cols-6 gap-3 border-b border-neutral-200/80 bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-500">
          <span>Date</span>
          <span>Locale</span>
          <span>Status</span>
          <span>{usesUpdatedAt ? "Updated" : "Created"}</span>
          <span>ID</span>
          <span>Actions</span>
        </div>

        {data?.length ? (
          data.map((pairing) => {
            const displayDate = pairing.pairing_date
              ? new Date(pairing.pairing_date).toLocaleDateString()
              : "—";
            const updatedValue = pairing.updated_at ?? pairing.created_at;
            const updatedLabel = updatedValue
              ? new Date(updatedValue).toLocaleString()
              : "—";

            return (
              <div
                key={pairing.id}
                className="grid grid-cols-6 gap-3 border-b border-neutral-200/60 px-4 py-4 text-sm text-neutral-700 last:border-b-0"
              >
                <span>{displayDate}</span>
                <span>{pairing.locale ?? "—"}</span>
                <span className="capitalize">{pairing.status ?? "—"}</span>
                <span className="text-xs text-neutral-500">{updatedLabel}</span>
                <span className="text-xs text-neutral-500">
                  {pairing.id.slice(0, 8)}
                </span>
                <div className="flex flex-col gap-2">
                  <Link
                    className="text-xs text-neutral-600 underline"
                    href={`/admin/pairings/${pairing.id}`}
                  >
                    Edit
                  </Link>
                  <AdminRowActions
                    pairingId={pairing.id}
                    locale={pairing.locale ?? "en"}
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

function FilterChip({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 ${
        active
          ? "border-neutral-900 text-neutral-900"
          : "border-neutral-200 text-neutral-500"
      }`}
    >
      {children}
    </Link>
  );
}

async function fetchPairings(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  filter: string,
  today: string,
) {
  const base = buildFilterQuery(
    supabase
      .from("pairings")
      .select("id, pairing_date, locale, status, created_at, updated_at"),
    filter,
    today,
  );

  const initialResult = await base
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });
  let data = initialResult.data as PairingRow[] | null;
  let error = initialResult.error;

  if (error?.message?.includes("updated_at")) {
    const fallback = buildFilterQuery(
      supabase
        .from("pairings")
        .select("id, pairing_date, locale, status, created_at"),
      filter,
      today,
    );
    const fallbackResult = await fallback
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    data = fallbackResult.data as PairingRow[] | null;
    error = fallbackResult.error;
    return { data: data as PairingRow[] | null, error: error?.message, usesUpdatedAt: false };
  }

  return { data: data as PairingRow[] | null, error: error?.message, usesUpdatedAt: true };
}

function buildFilterQuery<T>(query: T, filter: string, today: string): T {
  const builder = query as unknown as FilterableQuery;
  if (filter === "approved") {
    return builder.eq("status", "approved") as unknown as T;
  }
  if (filter === "scheduled") {
    return builder.eq("status", "approved").gt("pairing_date", today) as unknown as T;
  }
  if (filter === "draft") {
    return builder.eq("status", "draft") as unknown as T;
  }
  return query;
}

type FilterableQuery = {
  eq: (column: string, value: string) => FilterableQuery;
  gt: (column: string, value: string) => FilterableQuery;
};

async function fetchTodayApprovedPairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  today: string,
  locale: string,
) {
  const { data, error } = await supabase
    .from("pairings")
    .select("id")
    .eq("status", "approved")
    .eq("pairing_date", today)
    .eq("locale", locale)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Failed to check today pairing:", error.message);
    return { exists: false, error: error.message };
  }

  return { exists: Boolean(data?.length), error: null };
}

function getSeoulDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}
