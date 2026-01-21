import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const DEFAULT_LOCALE = "en";
const DEFAULT_CHANNEL = "email";
const MAX_RETRIES = 3;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.SITE_URL;
  const fallbackCurationId = process.env.FALLBACK_CURATION_ID;

  if (!supabaseUrl || !supabaseKey || !siteUrl) {
    return NextResponse.json(
      { error: "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SITE_URL." },
      { status: 500 },
    );
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const deliveryDate = getSeoulDateString();
  const runStartedAt = new Date().toISOString();

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const pairingId = await fetchTodayPairingId(
    supabase,
    deliveryDate,
    DEFAULT_LOCALE,
  );
  const curationId = pairingId || fallbackCurationId || "";

  if (!curationId) {
    return NextResponse.json(
      { error: "No pairing for today and FALLBACK_CURATION_ID is not set." },
      { status: 500 },
    );
  }

  const { data: recipients, error: recipientsError } = await supabase
    .from("profiles")
    .select("id, notification_opt_in")
    .eq("notification_opt_in", true);

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

  for (const recipient of recipients ?? []) {
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
    const sendResult = await sendInvite(
      normalizedSiteUrl,
      data.user_id,
      data.curation_id,
    );

    if (sendResult.ok) {
      summary.sent += 1;
      await markInviteSent(supabase, data.id, runStartedAt);
    } else {
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

  const { data: failedRows, error: failedError } = await supabase
    .from("invite_deliveries")
    .select("id, user_id, retry_count, curation_id")
    .eq("delivery_date", deliveryDate)
    .eq("status", "failed")
    .lt("retry_count", MAX_RETRIES);

  if (failedError) {
    return NextResponse.json(
      { error: `Failed to load retries: ${failedError.message}`, summary },
      { status: 500 },
    );
  }

  for (const row of failedRows ?? []) {
    summary.retried += 1;
    const retryResult = await sendInvite(
      normalizedSiteUrl,
      row.user_id,
      row.curation_id,
    );

    if (retryResult.ok) {
      summary.sent += 1;
      await markInviteSent(supabase, row.id, runStartedAt);
    } else {
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

  return NextResponse.json({ ok: true, summary });
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
    .maybeSingle();

  if (error) {
    console.error("Failed to load today pairing:", error.message);
    return null;
  }

  return data?.id ?? null;
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

async function sendInvite(
  siteUrl: string,
  userId: string,
  curationId: string,
) {
  try {
    const link = `${siteUrl}/login?redirect=${encodeURIComponent(
      `/c/${curationId}`,
    )}`;
    console.log(`[quiet-invite] ${userId}: ${link}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : null };
  }
}

async function markInviteSent(
  client: SupabaseClient,
  inviteId: string,
  nowIso: string,
) {
  await client
    .from("invite_deliveries")
    .update({
      status: "sent",
      error_message: null,
      last_attempt_at: nowIso,
      updated_at: nowIso,
    })
    .eq("id", inviteId);
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
    await client.from("invite_deliveries").insert({
      user_id: params.userId,
      delivery_date: params.deliveryDate,
      channel: DEFAULT_CHANNEL,
      curation_id: "unknown",
      status: "failed",
      error_message: params.errorMessage,
      retry_count: nextRetry,
      last_attempt_at: nowIso,
      updated_at: nowIso,
    });
    return;
  }

  await client
    .from("invite_deliveries")
    .update({
      status: "failed",
      error_message: params.errorMessage,
      retry_count: nextRetry,
      last_attempt_at: nowIso,
      updated_at: nowIso,
    })
    .eq("id", params.inviteId);
}
