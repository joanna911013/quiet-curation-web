"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabaseServer";

export type PairingFormInput = {
  id?: string | null;
  pairing_date: string;
  locale: string;
  status?: string | null;
  verse_id: string;
  curation_id?: string | null;
  literature_author?: string | null;
  literature_title?: string | null;
  literature_source?: string | null;
  literature_text?: string | null;
  rationale_short?: string | null;
};

export type ActionResult =
  | { ok: true; pairingId: string; status?: string; lastSavedAt: string }
  | {
      ok: false;
      error: string;
      errors?: string[];
      existingPairingId?: string;
    };

type AdminContext =
  | { ok: true; supabase: Awaited<ReturnType<typeof createSupabaseServer>>; userId: string }
  | { ok: false; error: string };

const MAX_EXCERPT_WORDS = 70;
const RATIONALE_MAX_CHARS = 240;

async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "not_authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to read profile role:", profileError.message);
  }

  if (profile?.role !== "admin") {
    return { ok: false, error: "not_authorized" };
  }

  return { ok: true, supabase, userId: user.id };
}

export async function savePairing(
  input: PairingFormInput,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const pairingDate = input.pairing_date?.trim();
  const locale = input.locale?.trim();
  const verseId = input.verse_id?.trim();
  const literatureText = input.literature_text?.trim() ?? "";

  const errors: string[] = [];
  if (!pairingDate) {
    errors.push("Pairing date is required.");
  }
  if (!locale) {
    errors.push("Locale is required.");
  }

  if (errors.length) {
    return { ok: false, error: "validation_failed", errors };
  }

  const payload = {
    pairing_date: pairingDate,
    locale,
    verse_id: verseId || null,
    curation_id: normalizeOptional(input.curation_id),
    literature_author: normalizeOptional(input.literature_author),
    literature_title: normalizeOptional(input.literature_title),
    literature_source: normalizeOptional(input.literature_source),
    literature_text: literatureText || null,
    rationale_short: normalizeOptional(input.rationale_short, ""),
  };

  if (input.status === "draft") {
    Object.assign(payload, { status: "draft" });
  }

  const nowIso = new Date().toISOString();

  if (!input.id) {
    const existing = await findExistingPairing(
      admin.supabase,
      pairingDate,
      locale,
    );

    if (existing?.id) {
      return {
        ok: false,
        error: "Pairing already exists for this date and locale.",
        errors: ["Pairing already exists for this date and locale."],
        existingPairingId: existing.id,
      };
    }

    const { data, error } = await admin.supabase
      .from("pairings")
      .insert(payload)
      .select("id, status")
      .single();

    if (error || !data) {
      if (error?.code === "23505") {
        const duplicate = await findExistingPairing(
          admin.supabase,
          pairingDate,
          locale,
        );
        return {
          ok: false,
          error: "Pairing already exists for this date and locale.",
          errors: ["Pairing already exists for this date and locale."],
          existingPairingId: duplicate?.id,
        };
      }
      return {
        ok: false,
        error: error?.message ?? "Failed to create pairing.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/pairings");
    return { ok: true, pairingId: data.id, status: data.status, lastSavedAt: nowIso };
  }

  const { data, error } = await admin.supabase
    .from("pairings")
    .update(payload)
    .eq("id", input.id)
    .select("id, status")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Failed to update pairing." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pairings");
  revalidatePath(`/admin/pairings/${input.id}`);
  return { ok: true, pairingId: data.id, status: data.status, lastSavedAt: nowIso };
}

export async function approvePairing(pairingId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: pairing, error: pairingError } = await admin.supabase
    .from("pairings")
    .select(
      "id, pairing_date, locale, verse_id, literature_author, literature_title, literature_source, literature_text, rationale_short",
    )
    .eq("id", pairingId)
    .maybeSingle();

  if (pairingError || !pairing) {
    return { ok: false, error: "Pairing not found." };
  }

  const errors = await validatePairing(admin.supabase, pairing);
  if (errors.length) {
    return { ok: false, error: "validation_failed", errors };
  }

  // Option A: block approval if another approved pairing exists for the same date+locale.
  const { data: existing, error: existingError } = await admin.supabase
    .from("pairings")
    .select("id")
    .eq("pairing_date", pairing.pairing_date)
    .eq("locale", pairing.locale)
    .eq("status", "approved")
    .neq("id", pairingId)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: existingError.message };
  }

  if (existing) {
    return {
      ok: false,
      error: "Already approved for this date and locale.",
      errors: ["Already approved for this date and locale."],
    };
  }

  const { error } = await admin.supabase
    .from("pairings")
    .update({ status: "approved" })
    .eq("id", pairingId);

  if (error) {
    return { ok: false, error: error.message };
  }

  const nowIso = new Date().toISOString();
  revalidatePath("/admin");
  revalidatePath("/admin/pairings");
  revalidatePath(`/admin/pairings/${pairingId}`);
  return { ok: true, pairingId, status: "approved", lastSavedAt: nowIso };
}

export async function unapprovePairing(
  pairingId: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase
    .from("pairings")
    .update({ status: "draft" })
    .eq("id", pairingId);

  if (error) {
    return { ok: false, error: error.message };
  }

  const nowIso = new Date().toISOString();
  revalidatePath("/admin");
  revalidatePath("/admin/pairings");
  revalidatePath(`/admin/pairings/${pairingId}`);
  return { ok: true, pairingId, status: "draft", lastSavedAt: nowIso };
}

export async function setTodayPairing(
  pairingId: string,
  locale: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: pairing, error: pairingError } = await admin.supabase
    .from("pairings")
    .select("id, status")
    .eq("id", pairingId)
    .maybeSingle();

  if (pairingError || !pairing) {
    return { ok: false, error: "Pairing not found." };
  }

  if (pairing.status !== "approved") {
    return { ok: false, error: "Only approved pairings can be set as today." };
  }

  const today = getSeoulDateString();
  const { data: existing, error: existingError } = await admin.supabase
    .from("pairings")
    .select("id")
    .eq("pairing_date", today)
    .eq("locale", locale)
    .eq("status", "approved")
    .neq("id", pairingId)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: existingError.message };
  }

  if (existing) {
    return { ok: false, error: "Already approved for today." };
  }

  const { error } = await admin.supabase
    .from("pairings")
    .update({ pairing_date: today })
    .eq("id", pairingId);

  if (error) {
    return { ok: false, error: error.message };
  }

  const nowIso = new Date().toISOString();
  revalidatePath("/admin");
  revalidatePath("/admin/pairings");
  revalidatePath(`/admin/pairings/${pairingId}`);
  return { ok: true, pairingId, status: "approved", lastSavedAt: nowIso };
}

async function validatePairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  pairing: {
    pairing_date: string | null;
    locale: string | null;
    verse_id: string | null;
    literature_author: string | null;
    literature_title: string | null;
    literature_source: string | null;
    literature_text: string | null;
    rationale_short: string | null;
  },
) {
  const errors: string[] = [];

  if (!pairing.pairing_date) {
    errors.push("Pairing date is required.");
  }
  if (!pairing.locale) {
    errors.push("Locale is required.");
  }

  if (!pairing.verse_id) {
    errors.push("Verse is required.");
  }

  let verseRef = "";
  let translation = "";

  if (pairing.verse_id) {
    const { data: verse, error: verseError } = await supabase
      .from("verses")
      .select("canonical_ref, translation, book, chapter, verse")
      .eq("id", pairing.verse_id)
      .maybeSingle();

    if (verseError || !verse) {
      errors.push("Verse not found in DB.");
    } else {
      translation = verse.translation?.trim() ?? "";
      verseRef =
        verse.canonical_ref?.trim() ??
        formatVerseReference(verse) ??
        "";

      if (!verseRef) {
        errors.push("Verse reference is missing.");
      }
      if (!translation) {
        errors.push("Verse translation is missing.");
      }
    }
  }

  const author = pairing.literature_author?.trim();
  const title = pairing.literature_title?.trim();
  if (!author && !title) {
    errors.push("Literature author or title is required.");
  }

  if (!pairing.literature_source?.trim()) {
    errors.push("Literature source is required.");
  }

  const excerpt = pairing.literature_text?.trim() ?? "";
  if (!excerpt) {
    errors.push("Literature excerpt is required.");
  } else {
    const wordCount = countWords(excerpt);
    if (wordCount > MAX_EXCERPT_WORDS) {
      errors.push(`Literature excerpt exceeds ${MAX_EXCERPT_WORDS} words.`);
    }
  }

  const rationale = pairing.rationale_short?.trim() ?? "";
  if (!rationale) {
    errors.push("Rationale is required.");
  } else if (rationale.length > RATIONALE_MAX_CHARS) {
    errors.push(`Rationale exceeds ${RATIONALE_MAX_CHARS} characters.`);
  }

  return errors;
}

function normalizeOptional(value?: string | null, fallback: string | null = null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed;
}

async function findExistingPairing(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  pairingDate: string,
  locale: string,
) {
  const { data, error } = await supabase
    .from("pairings")
    .select("id")
    .eq("pairing_date", pairingDate)
    .eq("locale", locale)
    .maybeSingle();

  if (error) {
    console.error("Failed to check existing pairing:", error.message);
    return null;
  }

  return data;
}

function countWords(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function formatVerseReference(verse: {
  book: string | null;
  chapter: number | null;
  verse: number | null;
}) {
  if (!verse.book || !verse.chapter || !verse.verse) {
    return null;
  }
  return `${verse.book} ${verse.chapter}:${verse.verse}`;
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
