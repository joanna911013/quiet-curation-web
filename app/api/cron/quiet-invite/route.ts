import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { renderQuietInviteEmail } from "@/lib/emails/renderQuietInviteEmail";
import { sendInviteEmail } from "@/lib/emails/sendInviteEmail";
import { logInfo, logWarn, maskEmail, truncateText } from "@/lib/observability";
import { resolveVerseText } from "@/lib/verses";

export const runtime = "nodejs";

const DEFAULT_LOCALE = "en";
const DEFAULT_CHANNEL = "email";
const MAX_RETRIES = 3;

export async function GET(request: Request) {
  const runId = randomUUID();
  const requestId = runId;
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    logWarn("quiet_invite.auth_failed", {
      request_id: requestId,
      run_id: runId,
      route: "cron/quiet-invite",
      reason: "cron_secret_missing",
    });
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    logWarn("quiet_invite.auth_failed", {
      request_id: requestId,
      run_id: runId,
      route: "cron/quiet-invite",
      reason: "invalid_auth",
    });
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.SITE_URL;
  const fallbackCurationId = process.env.FALLBACK_CURATION_ID;
  const emailProvider = (process.env.EMAIL_PROVIDER ?? "dryrun").toLowerCase();
  const isDryRun = process.env.EMAIL_DRY_RUN === "true";
  const cronDebug = process.env.CRON_DEBUG === "true";

  if (!supabaseUrl || !supabaseKey || !siteUrl) {
    return NextResponse.json(
      { error: "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SITE_URL." },
      { status: 500 },
    );
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const deliveryDate = getSeoulDateString();
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Approved-only gate for today's pairing; fallback uses safe set before env fallback.
  const pairingId = await fetchTodayPairingId(
    supabase,
    deliveryDate,
    DEFAULT_LOCALE,
  );
  const safePairingId = pairingId
    ? null
    : await fetchSafeSetPairingId(supabase, DEFAULT_LOCALE);
  const curationId = pairingId || safePairingId || fallbackCurationId || "";

  if (!curationId) {
    return NextResponse.json(
      {
        error:
          "No pairing for today and no safe set pairing found (FALLBACK_CURATION_ID is not set).",
      },
      { status: 500 },
    );
  }

  const inviteContent = await fetchInviteContent(supabase, curationId);

  const { data: recipients, error: recipientsError } = await supabase
    .from("profiles")
    .select("id, email, notification_opt_in")
    .eq("notification_opt_in", true)
    .not("email", "is", null)
    .neq("email", "");

  if (recipientsError) {
    return NextResponse.json(
      { error: `Failed to load profiles: ${recipientsError.message}` },
      { status: 500 },
    );
  }

  const summary = {
    delivery_date: deliveryDate,
    recipients: recipients?.length ?? 0,
    inserted: 0,
    skipped: 0,
    sent: 0,
    failed: 0,
    retried: 0,
  };

  logInfo("quiet_invite.run_started", {
    request_id: requestId,
    run_id: runId,
    route: "cron/quiet-invite",
    delivery_date: deliveryDate,
    locale: DEFAULT_LOCALE,
    recipients_count: recipients?.length ?? 0,
    chosen_curation_id: curationId,
    pairing_id: pairingId ?? safePairingId ?? null,
    fallback_used: !pairingId,
  });

  const recipientById = new Map(
    (recipients ?? []).map((recipient) => [recipient.id, recipient]),
  );
  const recipientIds = (recipients ?? []).map((recipient) => recipient.id);

  for (const recipient of recipients ?? []) {
    const recipientEmail = recipient.email?.trim();

    if (!recipientEmail) {
      summary.skipped += 1;
      continue;
    }

    const { data, error } = await supabase
      .from("invite_deliveries")
      .insert({
        user_id: recipient.id,
        delivery_date: deliveryDate,
        channel: DEFAULT_CHANNEL,
        curation_id: curationId,
        status: "pending",
      })
      .select("id, user_id, retry_count, curation_id")
      .single();

    if (error) {
      if (error.code === "23505") {
        summary.skipped += 1;
        continue;
      }
      logWarn("quiet_invite.recipient_failed", {
        request_id: requestId,
        run_id: runId,
        route: "cron/quiet-invite",
        delivery_date: deliveryDate,
        locale: DEFAULT_LOCALE,
        user_id: recipient.id,
        invite_delivery_id: null,
        to_email: maskEmail(recipientEmail),
        provider: emailProvider,
        curation_id: curationId,
        pairing_id: pairingId ?? safePairingId ?? null,
        retry_count: 0,
        error_message: truncateText(error.message ?? "insert_failed", 200),
      });
      summary.failed += 1;
      await markInviteFailed(supabase, {
        inviteId: null,
        userId: recipient.id,
        deliveryDate,
        errorMessage: error.message,
      });
      continue;
    }

    summary.inserted += 1;
    await markInviteAttempt(supabase, data.id);
    const sendStart = Date.now();
    const sendResult = await sendInviteEmail({
      recipient: { id: data.user_id, email: recipientEmail },
      ...inviteContent,
      siteUrl: normalizedSiteUrl,
    });
    const latencyMs = Date.now() - sendStart;

    if (sendResult.ok) {
      logInfo("quiet_invite.recipient_sent", {
        request_id: requestId,
        run_id: runId,
        route: "cron/quiet-invite",
        delivery_date: deliveryDate,
        locale: DEFAULT_LOCALE,
        user_id: data.user_id,
        invite_delivery_id: data.id,
        to_email: maskEmail(recipientEmail),
        provider: emailProvider,
        curation_id: curationId,
        pairing_id: pairingId ?? safePairingId ?? null,
        latency_ms: latencyMs,
      });
      summary.sent += 1;
      await markInviteSent(supabase, data.id);
    } else {
      logWarn("quiet_invite.recipient_failed", {
        request_id: requestId,
        run_id: runId,
        route: "cron/quiet-invite",
        delivery_date: deliveryDate,
        locale: DEFAULT_LOCALE,
        user_id: data.user_id,
        invite_delivery_id: data.id,
        to_email: maskEmail(recipientEmail),
        provider: emailProvider,
        curation_id: curationId,
        pairing_id: pairingId ?? safePairingId ?? null,
        retry_count: data.retry_count ?? 0,
        error_message: truncateText(sendResult.error ?? "send_failed", 200),
      });
      summary.failed += 1;
      await markInviteFailed(supabase, {
        inviteId: data.id,
        userId: data.user_id,
        deliveryDate,
        errorMessage: sendResult.error ?? "Unknown send error",
        retryCount: data.retry_count,
      });
    }
  }

  if (!recipientIds.length) {
    logInfo("quiet_invite.run_finished", {
      request_id: requestId,
      run_id: runId,
      route: "cron/quiet-invite",
      locale: DEFAULT_LOCALE,
      ...summary,
    });
    return NextResponse.json({
      ok: true,
      run_id: runId,
      request_id: requestId,
      summary,
      ...(cronDebug && { emailProvider, isDryRun }),
    });
  }

  const { data: failedRows, error: failedError } = await supabase
    .from("invite_deliveries")
    .select("id, user_id, retry_count, curation_id")
    .eq("delivery_date", deliveryDate)
    .in("status", ["failed", "pending"])
    .lt("retry_count", MAX_RETRIES)
    .in("user_id", recipientIds);

  if (failedError) {
    return NextResponse.json(
      { error: `Failed to load retries: ${failedError.message}`, summary },
      { status: 500 },
    );
  }

  for (const row of failedRows ?? []) {
    const retryRecipient = recipientById.get(row.user_id);
    const retryEmail = retryRecipient?.email?.trim();

    if (!retryEmail) {
      summary.skipped += 1;
      continue;
    }

    summary.retried += 1;
    await markInviteAttempt(supabase, row.id);
    const retryStart = Date.now();
    const retryResult = await sendInviteEmail({
      recipient: { id: row.user_id, email: retryEmail },
      ...inviteContent,
      siteUrl: normalizedSiteUrl,
    });
    const retryLatencyMs = Date.now() - retryStart;

    if (retryResult.ok) {
      logInfo("quiet_invite.recipient_sent", {
        request_id: requestId,
        run_id: runId,
        route: "cron/quiet-invite",
        delivery_date: deliveryDate,
        locale: DEFAULT_LOCALE,
        user_id: row.user_id,
        invite_delivery_id: row.id,
        to_email: maskEmail(retryEmail),
        provider: emailProvider,
        curation_id: curationId,
        pairing_id: pairingId ?? safePairingId ?? null,
        latency_ms: retryLatencyMs,
      });
      summary.sent += 1;
      await markInviteSent(supabase, row.id);
    } else {
      logWarn("quiet_invite.recipient_failed", {
        request_id: requestId,
        run_id: runId,
        route: "cron/quiet-invite",
        delivery_date: deliveryDate,
        locale: DEFAULT_LOCALE,
        user_id: row.user_id,
        invite_delivery_id: row.id,
        to_email: maskEmail(retryEmail),
        provider: emailProvider,
        curation_id: curationId,
        pairing_id: pairingId ?? safePairingId ?? null,
        retry_count: row.retry_count ?? 0,
        error_message: truncateText(retryResult.error ?? "send_failed", 200),
      });
      summary.failed += 1;
      await markInviteFailed(supabase, {
        inviteId: row.id,
        userId: row.user_id,
        deliveryDate,
        errorMessage: retryResult.error ?? "Unknown send error",
        retryCount: row.retry_count,
      });
    }
  }

  logInfo("quiet_invite.run_finished", {
    request_id: requestId,
    run_id: runId,
    route: "cron/quiet-invite",
    locale: DEFAULT_LOCALE,
    ...summary,
  });

  return NextResponse.json({
    ok: true,
    run_id: runId,
    request_id: requestId,
    summary,
    ...(cronDebug && { emailProvider, isDryRun }),
  });
}

async function fetchTodayPairingId(
  client: SupabaseClient,
  date: string,
  locale: string,
) {
  const { data, error } = await client
    .from("pairings")
    .select("id")
    .eq("pairing_date", date)
    .eq("locale", locale)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .maybeSingle();

  if (error) {
    console.error("Failed to load today pairing:", error.message);
    return null;
  }

  return data?.id ?? null;
}

async function fetchSafeSetPairingId(
  client: SupabaseClient,
  locale: string,
) {
  const { data, error } = await client
    .from("pairings")
    .select("id")
    .eq("status", "approved")
    .eq("locale", locale)
    .eq("is_safe_set", true)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Failed to load safe set pairing:", error.message);
    return null;
  }

  return data?.[0]?.id ?? null;
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

type QuietInviteContent = Omit<
  Parameters<typeof renderQuietInviteEmail>[0],
  "siteUrl"
>;

async function fetchInviteContent(
  client: SupabaseClient,
  curationId: string,
): Promise<QuietInviteContent> {
  const fallback: QuietInviteContent = {
    curation: { id: curationId },
  };

  const { data: pairingRow, error: pairingError } = await client
    .from("pairings")
    .select(
      "id, pairing_date, rationale_short, literature_text, literature_author, literature_title, literature_work, literature_source, verse_id",
    )
    .eq("id", curationId)
    .maybeSingle();

  if (pairingError) {
    console.error("[quiet-invite] Failed to load pairing:", pairingError);
    return fallback;
  }

  if (!pairingRow) {
    return fallback;
  }

  const curation = {
    id: pairingRow.id,
    pairing_date: pairingRow.pairing_date,
    rationale_short: pairingRow.rationale_short,
    literature_text: pairingRow.literature_text,
    literature_title: pairingRow.literature_title,
    literature_work: pairingRow.literature_work,
  };

  const pairing: NonNullable<QuietInviteContent["pairing"]> = {
    literature_text: pairingRow.literature_text,
    literature_author: pairingRow.literature_author,
    literature_title: pairingRow.literature_title,
    literature_work: pairingRow.literature_work,
    literature_source: pairingRow.literature_source,
  };

  if (pairingRow.verse_id) {
    const { data: verseRow, error: verseError } = await client
      .from("verses")
      .select("book, chapter, verse, translation, canonical_ref, verse_text")
      .eq("id", pairingRow.verse_id)
      .maybeSingle();

    if (verseError) {
      console.error("[quiet-invite] Failed to load verse:", verseError);
    } else if (verseRow) {
      pairing.canonical_ref =
        verseRow.canonical_ref ?? formatVerseReference(verseRow);
      pairing.verse_text = resolveVerseText(verseRow.verse_text);
      pairing.translation = verseRow.translation;
    }
  }

  return { curation, pairing };
}

function formatVerseReference(verse: {
  canonical_ref?: string | null;
  book?: string | null;
  chapter?: number | null;
  verse?: number | null;
}) {
  if (verse.canonical_ref) {
    return verse.canonical_ref;
  }
  if (verse.book && verse.chapter && verse.verse) {
    return `${verse.book} ${verse.chapter}:${verse.verse}`;
  }
  return null;
}

async function markInviteAttempt(client: SupabaseClient, inviteId: string) {
  const nowIso = new Date().toISOString();
  const { error } = await client
    .from("invite_deliveries")
    .update({ last_attempt_at: nowIso })
    .eq("id", inviteId);

  if (error) {
    console.error("[quiet-invite] markInviteAttempt failed:", {
      inviteId,
      error,
    });
  }
}

async function markInviteSent(client: SupabaseClient, inviteId: string) {
  const nowIso = new Date().toISOString();
  const { error } = await client
    .from("invite_deliveries")
    .update({
      status: "sent",
      error_message: null,
      last_attempt_at: nowIso,
    })
    .eq("id", inviteId);

  if (error) {
    console.error("[quiet-invite] markInviteSent failed:", error);
    return;
  }
}

async function markInviteFailed(
  client: SupabaseClient,
  params: {
    inviteId: string | null;
    userId: string;
    deliveryDate: string;
    errorMessage: string;
    retryCount?: number | null;
  },
) {
  const nowIso = new Date().toISOString();
  const nextRetry = (params.retryCount ?? 0) + 1;

  if (!params.inviteId) {
    console.error("[quiet-invite] markInviteFailed skipped: missing inviteId", {
      userId: params.userId,
      deliveryDate: params.deliveryDate,
    });
    return;
  }

  const { error } = await client
    .from("invite_deliveries")
    .update({
      status: "failed",
      error_message: params.errorMessage,
      retry_count: nextRetry,
      last_attempt_at: nowIso,
    })
    .eq("id", params.inviteId);

  if (error) {
    console.error("[quiet-invite] markInviteFailed failed:", {
      inviteId: params.inviteId,
      error,
    });
  }
}
