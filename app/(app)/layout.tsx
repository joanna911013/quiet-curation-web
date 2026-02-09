import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { AppHeader } from "@/components/app-header";

export const dynamic = "force-dynamic";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const headerStore = await headers();
    const currentPath = resolveCurrentPath(headerStore);
    const redirectTarget = currentPath
      ? `/?redirect=${encodeURIComponent(currentPath)}`
      : "/";
    redirect(redirectTarget);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      {children}
    </div>
  );
}

function resolveCurrentPath(headerStore: Headers) {
  const candidates = [
    headerStore.get("x-next-url"),
    headerStore.get("next-url"),
    headerStore.get("x-url"),
    headerStore.get("x-original-url"),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
      try {
        const url = new URL(candidate);
        return `${url.pathname}${url.search}`;
      } catch {
        continue;
      }
    }
    if (candidate.startsWith("/")) {
      return candidate;
    }
  }

  return null;
}
