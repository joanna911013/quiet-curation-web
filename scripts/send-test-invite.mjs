#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const options = parseArgs(args);

await loadEnvLocal();

const siteUrl = options.baseUrl || process.env.SITE_URL;
const cronSecret = process.env.CRON_SECRET;

if (!options.email) {
  console.error("Missing --email");
  process.exit(1);
}

if (!siteUrl) {
  console.error("Missing SITE_URL env var (or pass --base-url).");
  process.exit(1);
}

if (!cronSecret) {
  console.error("Missing CRON_SECRET env var.");
  process.exit(1);
}

const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
const url = new URL(`${normalizedSiteUrl}/api/cron/quiet-invite`);
url.searchParams.set("test_email", options.email);
if (options.locale) {
  url.searchParams.set("test_locale", options.locale);
}

const response = await fetch(url.toString(), {
  headers: {
    Authorization: `Bearer ${cronSecret}`,
  },
});

const payload = await response.json().catch(() => ({}));

if (!response.ok) {
  console.error("Test invite failed:", payload);
  process.exit(1);
}

console.log("Test invite sent:", payload);

function parseArgs(argv) {
  const parsed = {
    email: null,
    locale: null,
    baseUrl: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--email") {
      parsed.email = argv[i + 1] ?? null;
      i += 1;
    } else if (arg.startsWith("--email=")) {
      parsed.email = arg.split("=")[1] ?? null;
    } else if (arg === "--locale") {
      parsed.locale = argv[i + 1] ?? null;
      i += 1;
    } else if (arg.startsWith("--locale=")) {
      parsed.locale = arg.split("=")[1] ?? null;
    } else if (arg === "--base-url") {
      parsed.baseUrl = argv[i + 1] ?? null;
      i += 1;
    } else if (arg.startsWith("--base-url=")) {
      parsed.baseUrl = arg.split("=")[1] ?? null;
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
