#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_LOCALE = "en";
const DEFAULT_TRANSLATION = "NIV";
const DEFAULT_MODEL = "text-embedding-3-small";
const DEFAULT_MIN_EMBEDDINGS_GAP = 5;
const DEFAULT_MODE = "skip";

const args = process.argv.slice(2);
const options = parseArgs(args);

await loadEnvLocal();

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (options.mode === "skip") {
  console.log("Embedding mode=skip. No embeddings will be written.");
  process.exit(0);
}

if (!openaiKey) {
  console.log(
    "OPENAI_API_KEY missing. Skipping embeddings for Option C.",
  );
  process.exit(0);
}

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const verses = await fetchEligibleVerses(supabase, options);
const eligibleIds = verses.map((verse) => verse.id);
const existingIds = await fetchExistingEmbeddings(supabase, eligibleIds);

const toEmbed = verses.filter((verse) => !existingIds.has(verse.id));
const selected = options.limit
  ? toEmbed.slice(0, options.limit)
  : toEmbed;

console.log(`Eligible verses: ${verses.length}`);
console.log(`Already embedded: ${existingIds.size}`);
console.log(`Selected for embedding: ${selected.length}`);

if (selected.length === 0) {
  console.log("No verses to embed.");
  process.exit(0);
}

if (options.dryRun) {
  console.log("Dry run enabled. Skipping embedding calls.");
  process.exit(0);
}

let embeddedCount = 0;
let failedCount = 0;

for (let i = 0; i < selected.length; i += options.batchSize) {
  const batch = selected.slice(i, i + options.batchSize);
  const texts = batch.map((verse) => verse.verse_text);

  try {
    const embeddings = await fetchEmbeddings(openaiKey, options.model, texts);
    const rows = embeddings.map((embedding, index) => ({
      verse_id: batch[index].id,
      embedding,
      model: options.model,
      dims: embedding.length,
    }));

    const { data, error } = await supabase
      .from("verse_embeddings")
      .upsert(rows, { onConflict: "verse_id", ignoreDuplicates: true })
      .select("verse_id");

    if (error) {
      throw error;
    }

    embeddedCount += data?.length ?? 0;
    console.log(
      `Batch ${Math.floor(i / options.batchSize) + 1}/${Math.ceil(
        selected.length / options.batchSize,
      )}: embedded ${data?.length ?? 0}`,
    );
  } catch (error) {
    failedCount += batch.length;
    console.error("Embedding batch failed:", error?.message ?? error);
  }
}

console.log("Embedding summary:");
console.log(`  Selected: ${selected.length}`);
console.log(`  Embedded: ${embeddedCount}`);
console.log(`  Failed: ${failedCount}`);

const embeddedTotal = await countEmbeddingsForIds(
  supabase,
  eligibleIds,
);
const minRequired =
  options.limit != null
    ? Math.max(options.limit - DEFAULT_MIN_EMBEDDINGS_GAP, 0)
    : Math.max(verses.length - DEFAULT_MIN_EMBEDDINGS_GAP, 0);

console.log(
  `Post-run embeddings for eligible verses: ${embeddedTotal} (min required ${minRequired})`,
);

if (embeddedTotal < minRequired) {
  console.error("Embedding count below required threshold.");
  process.exitCode = 1;
}

async function fetchEligibleVerses(client, opts) {
  const { data, error } = await client
    .from("verses")
    .select("id, verse_text, canonical_ref")
    .eq("locale", opts.locale)
    .eq("translation", opts.translation)
    .not("verse_text", "is", null)
    .neq("verse_text", "");

  if (error) {
    throw new Error(`Failed to fetch verses: ${error.message}`);
  }

  return data ?? [];
}

async function fetchExistingEmbeddings(client, verseIds) {
  if (verseIds.length === 0) {
    return new Set();
  }

  const { data, error } = await client
    .from("verse_embeddings")
    .select("verse_id")
    .in("verse_id", verseIds);

  if (error) {
    throw new Error(`Failed to fetch embeddings: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.verse_id));
}

async function countEmbeddingsForIds(client, verseIds) {
  if (verseIds.length === 0) {
    return 0;
  }

  const { count, error } = await client
    .from("verse_embeddings")
    .select("verse_id", { count: "exact", head: true })
    .in("verse_id", verseIds);

  if (error) {
    throw new Error(`Failed to count embeddings: ${error.message}`);
  }

  return count ?? 0;
}

async function fetchEmbeddings(apiKey, model, inputs) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: inputs,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI error (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  if (!payload?.data || payload.data.length !== inputs.length) {
    throw new Error("OpenAI embeddings response did not match input size.");
  }

  return payload.data.map((item) => item.embedding);
}

function parseArgs(argv) {
  const parsed = {
    locale: DEFAULT_LOCALE,
    translation: DEFAULT_TRANSLATION,
    batchSize: DEFAULT_BATCH_SIZE,
    model: DEFAULT_MODEL,
    limit: null,
    dryRun: false,
    mode: DEFAULT_MODE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--locale") {
      parsed.locale = argv[i + 1] ?? DEFAULT_LOCALE;
      i += 1;
    } else if (arg.startsWith("--locale=")) {
      parsed.locale = arg.split("=")[1] ?? DEFAULT_LOCALE;
    } else if (arg === "--translation") {
      parsed.translation = argv[i + 1] ?? DEFAULT_TRANSLATION;
      i += 1;
    } else if (arg.startsWith("--translation=")) {
      parsed.translation = arg.split("=")[1] ?? DEFAULT_TRANSLATION;
    } else if (arg === "--batch-size") {
      parsed.batchSize = Number(argv[i + 1] ?? DEFAULT_BATCH_SIZE);
      i += 1;
    } else if (arg.startsWith("--batch-size=")) {
      parsed.batchSize = Number(arg.split("=")[1] ?? DEFAULT_BATCH_SIZE);
    } else if (arg === "--model") {
      parsed.model = argv[i + 1] ?? DEFAULT_MODEL;
      i += 1;
    } else if (arg.startsWith("--model=")) {
      parsed.model = arg.split("=")[1] ?? DEFAULT_MODEL;
    } else if (arg === "--limit") {
      parsed.limit = Number(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith("--limit=")) {
      parsed.limit = Number(arg.split("=")[1]);
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else if (arg === "--mode") {
      parsed.mode = argv[i + 1] ?? DEFAULT_MODE;
      i += 1;
    } else if (arg.startsWith("--mode=")) {
      parsed.mode = arg.split("=")[1] ?? DEFAULT_MODE;
    }
  }

  if (!Number.isInteger(parsed.batchSize) || parsed.batchSize <= 0) {
    parsed.batchSize = DEFAULT_BATCH_SIZE;
  }

  if (parsed.limit != null && !Number.isInteger(parsed.limit)) {
    parsed.limit = null;
  }

  if (!["openai", "skip"].includes(parsed.mode)) {
    parsed.mode = DEFAULT_MODE;
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
