#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_LOCALE = "en";
const DEFAULT_TRANSLATION = "NIV";
const DEFAULT_TOP_K = 5;

const args = process.argv.slice(2);
const options = parseArgs(args);

await loadEnvLocal();

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const queries =
  options.queries.length > 0
    ? options.queries
    : ["shepherd", "rest", "anxiety"];

for (const query of queries) {
  console.log(`\nQuery: "${query}"`);
  try {
    const { data, error } = await supabase.rpc("search_verses", {
      query_text: query,
      locale: options.locale,
      translation: options.translation,
      top_k: options.topK,
    });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("  No results.");
      continue;
    }

    data.forEach((row, index) => {
      const ref = row.canonical_ref ?? row.verse_id;
      const score = Number(row.score).toFixed(4);
      console.log(`  ${index + 1}. ${ref} (${score})`);
    });
  } catch (error) {
    console.error("  Search failed:", error?.message ?? error);
  }
}

function parseArgs(argv) {
  const parsed = {
    locale: DEFAULT_LOCALE,
    translation: DEFAULT_TRANSLATION,
    topK: DEFAULT_TOP_K,
    queries: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--locale") {
      parsed.locale = argv[i + 1] ?? DEFAULT_LOCALE;
      i += 1;
    } else if (arg.startsWith("--locale=")) {
      parsed.locale = arg.split("=")[1] ?? DEFAULT_LOCALE;
    } else if (arg === "--top-k") {
      parsed.topK = Number(argv[i + 1] ?? DEFAULT_TOP_K);
      i += 1;
    } else if (arg.startsWith("--top-k=")) {
      parsed.topK = Number(arg.split("=")[1] ?? DEFAULT_TOP_K);
    } else if (arg === "--translation") {
      parsed.translation = argv[i + 1] ?? DEFAULT_TRANSLATION;
      i += 1;
    } else if (arg.startsWith("--translation=")) {
      parsed.translation = arg.split("=")[1] ?? DEFAULT_TRANSLATION;
    } else if (arg === "--query") {
      parsed.queries.push(argv[i + 1] ?? "");
      i += 1;
    } else if (arg.startsWith("--query=")) {
      parsed.queries.push(arg.split("=")[1] ?? "");
    }
  }

  parsed.queries = parsed.queries.filter((q) => q);

  if (!Number.isInteger(parsed.topK) || parsed.topK <= 0) {
    parsed.topK = DEFAULT_TOP_K;
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
