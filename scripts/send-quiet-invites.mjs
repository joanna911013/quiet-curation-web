#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_LOCALE = "en";
const DEFAULT_CHANNEL = "email";

const args = process.argv.slice(2);
const options = parseArgs(args);

await loadEnvLocal();

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.SITE_URL;
const fallbackCurationId = process.env.FALLBACK_CURATION_ID;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars.",
  );
  process.exit(1);
}

if (!siteUrl) {
  console.error("Missing SITE_URL env var.");
  process.exit(1);
}

const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
const deliveryDate = getSeoulDateString();

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const pairingId = await fetchTodayPairingId(
  supabase,
  deliveryDate,
  options.locale,
);
const curationId = pairingId || fallbackCurationId || "";

if (!curationId) {
  console.error(
    "No pairing found for today and FALLBACK_CURATION_ID is not set.",
  );
  process.exit(1);
}

const { data: recipients, error: recipientsError } = await supabase
  .from("profiles")
  .select("id, notification_opt_in")
  .eq("notification_opt_in", true);

if (recipientsError) {
  if (recipientsError.message?.includes("notification_opt_in")) {
    console.error(
      "profiles.notification_opt_in is missing. Run scripts/sql/profiles_notification_opt_in.sql",
    );
  }
  console.error("Failed to load profiles:", recipientsError.message);
  process.exit(1);
}

if (!recipients || recipients.length === 0) {
  console.log("No opted-in recipients found.");
  process.exit(0);
}

console.log(
  `Delivery date (Asia/Seoul): ${deliveryDate} | recipients: ${recipients.length}`,
);
console.log(`Curation ID: ${curationId}`);

let insertedCount = 0;
let skippedCount = 0;
let failedCount = 0;

for (const recipient of recipients) {
  const { error: insertError } = await supabase
    .from("invite_deliveries")
    .insert({
      user_id: recipient.id,
      delivery_date: deliveryDate,
      channel: DEFAULT_CHANNEL,
      curation_id: curationId,
    });

  if (insertError) {
    if (insertError.code === "23505") {
      skippedCount += 1;
      console.log(`Skip (already sent): ${recipient.id}`);
      continue;
    }
    failedCount += 1;
    console.error(
      `Failed to insert invite for ${recipient.id}: ${insertError.message}`,
    );
    continue;
  }

  insertedCount += 1;
  const inviteLink = `${normalizedSiteUrl}/login?redirect=${encodeURIComponent(
    `/c/${curationId}`,
  )}`;
  console.log(`Invite for ${recipient.id}: ${inviteLink}`);
}

console.log("Summary:");
console.log(`  Inserted: ${insertedCount}`);
console.log(`  Skipped: ${skippedCount}`);
console.log(`  Failed: ${failedCount}`);

async function fetchTodayPairingId(client, date, locale) {
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

function parseArgs(argv) {
  const parsed = {
    locale: DEFAULT_LOCALE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--locale") {
      parsed.locale = argv[i + 1] ?? DEFAULT_LOCALE;
      i += 1;
    } else if (arg.startsWith("--locale=")) {
      parsed.locale = arg.split("=")[1] ?? DEFAULT_LOCALE;
    }
  }

  return parsed;
}

async function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  try {
    const content = await fs.readFile(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const withoutExport = trimmed.startsWith("export ")
        ? trimmed.slice(7).trim()
        : trimmed;
      const separatorIndex = withoutExport.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }
      const key = withoutExport.slice(0, separatorIndex).trim();
      let value = withoutExport.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}
