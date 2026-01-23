#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_BATCH_SIZE = 100;
const SAMPLE_ERROR_LIMIT = 5;

const args = process.argv.slice(2);
const options = parseArgs(args);

if (!options.input) {
  console.error("Missing --input <path>.");
  process.exit(1);
}

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

const inputPath = path.resolve(process.cwd(), options.input);

const rows = await loadRows(inputPath);
const { normalizedRows, rejectedRows } = validateRows(rows);

printValidationSummary(rows.length, normalizedRows.length, rejectedRows);

if (normalizedRows.length === 0) {
  console.error("No valid rows to ingest.");
  process.exit(1);
}

if (options.dryRun) {
  console.log("Dry run enabled. Skipping inserts and checks.");
  process.exit(0);
}

const summary = await ingestRows(
  supabase,
  normalizedRows,
  options.batchSize,
  options.updateExisting,
);

printIngestSummary(summary, normalizedRows.length);

const checks = await runSanityChecks(supabase);
printSanityChecks(checks);

if (!checks.ok) {
  process.exitCode = 1;
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

function parseArgs(argv) {
  const parsed = {
    input: "",
    batchSize: DEFAULT_BATCH_SIZE,
    dryRun: false,
    updateExisting: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") {
      parsed.input = argv[i + 1] ?? "";
      i += 1;
    } else if (arg.startsWith("--input=")) {
      parsed.input = arg.split("=")[1] ?? "";
    } else if (arg === "--batch-size") {
      parsed.batchSize = Number(argv[i + 1] ?? DEFAULT_BATCH_SIZE);
      i += 1;
    } else if (arg.startsWith("--batch-size=")) {
      parsed.batchSize = Number(arg.split("=")[1] ?? DEFAULT_BATCH_SIZE);
    } else if (arg === "--dry-run") {
      parsed.dryRun = true;
    } else if (arg === "--update-existing" || arg === "--update") {
      parsed.updateExisting = true;
    }
  }

  if (!Number.isInteger(parsed.batchSize) || parsed.batchSize <= 0) {
    parsed.batchSize = DEFAULT_BATCH_SIZE;
  }

  return parsed;
}

async function loadRows(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".json") {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.verses)) {
      return parsed.verses;
    }
    throw new Error("JSON must be an array or { verses: [] }.");
  }

  if (ext === ".csv") {
    const rows = parseCsv(content);
    if (rows.length === 0) {
      return [];
    }
    const headers = rows[0].map((header) =>
      header.replace(/^\uFEFF/, "").trim(),
    );
    return rows.slice(1).map((cells) => {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = cells[index] ?? "";
      });
      return row;
    });
  }

  throw new Error("Unsupported file type. Use .json or .csv.");
}

function parseCsv(content) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      if (row.length > 0 || current.trim() !== "") {
        row.push(current);
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (row.length > 0 || current.trim() !== "") {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function resolveFullVerseText(primary, fallback) {
  if (!primary) {
    return fallback;
  }
  if (!fallback) {
    return primary;
  }
  return primary.length >= fallback.length ? primary : fallback;
}

function isTitleCaseBook(book) {
  const allowedLower = new Set(["of", "the", "and"]);
  const parts = book.split(" ").filter(Boolean);

  if (parts.length === 0) {
    return false;
  }

  return parts.every((part, index) => {
    if (index === 0 && /^[1-3]$/.test(part)) {
      return true;
    }
    if (allowedLower.has(part)) {
      return true;
    }
    return /^[A-Z][a-z]+$/.test(part);
  });
}

function parsePositiveInt(value, field, errors, rowIndex) {
  if (value === null || value === undefined || value === "") {
    errors.push(`[row ${rowIndex}] ${field} is missing`);
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      errors.push(`[row ${rowIndex}] ${field} must be an integer`);
      return null;
    }
    if (trimmed.length > 1 && trimmed.startsWith("0")) {
      errors.push(`[row ${rowIndex}] ${field} has leading zeros`);
      return null;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      errors.push(`[row ${rowIndex}] ${field} must be > 0`);
      return null;
    }
    return parsed;
  }

  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0) {
      errors.push(`[row ${rowIndex}] ${field} must be > 0`);
      return null;
    }
    return value;
  }

  errors.push(`[row ${rowIndex}] ${field} must be an integer`);
  return null;
}

function validateRows(rows) {
  const normalizedRows = [];
  const rejectedRows = [];

  rows.forEach((raw, index) => {
    const rowIndex = index + 1;
    const errors = [];

    const locale = normalizeText(raw.locale);
    const translation = normalizeText(raw.translation);
    const book = normalizeText(raw.book);
    const canonicalRef = normalizeText(raw.canonical_ref);
    const verseText = normalizeText(raw.verse_text);
    const legacyText = normalizeText(raw.text);
    const resolvedVerseText = resolveFullVerseText(verseText, legacyText);

    if (!locale) {
      errors.push(`[row ${rowIndex}] locale is missing`);
    } else if (locale !== "en") {
      errors.push(`[row ${rowIndex}] locale must be "en"`);
    }

    if (!translation) {
      errors.push(`[row ${rowIndex}] translation is missing`);
    } else if (translation !== "NIV") {
      errors.push(`[row ${rowIndex}] translation must be "NIV"`);
    }

    if (!book) {
      errors.push(`[row ${rowIndex}] book is missing`);
    } else if (!isTitleCaseBook(book)) {
      errors.push(`[row ${rowIndex}] book is not Title Case`);
    }

    const chapter = parsePositiveInt(raw.chapter, "chapter", errors, rowIndex);
    const verse = parsePositiveInt(raw.verse, "verse", errors, rowIndex);

    if (!canonicalRef) {
      errors.push(`[row ${rowIndex}] canonical_ref is missing`);
    } else if (chapter && verse) {
      const expectedRef = `${book} ${chapter}:${verse}`;
      if (canonicalRef !== expectedRef) {
        errors.push(
          `[row ${rowIndex}] canonical_ref must be "${expectedRef}"`,
        );
      }
    }

    if (!resolvedVerseText) {
      errors.push(`[row ${rowIndex}] verse_text/text is missing`);
    }

    if (errors.length > 0) {
      rejectedRows.push({ rowIndex, errors });
      return;
    }

    normalizedRows.push({
      locale,
      translation,
      book,
      chapter,
      verse,
      canonical_ref: canonicalRef,
      verse_text: resolvedVerseText,
    });
  });

  return { normalizedRows, rejectedRows };
}

function printValidationSummary(total, valid, rejected) {
  console.log("Input rows:", total);
  console.log("Valid rows:", valid);
  console.log("Rejected rows:", rejected.length);

  if (rejected.length > 0) {
    console.log("Sample errors:");
    rejected.slice(0, SAMPLE_ERROR_LIMIT).forEach((row) => {
      row.errors.forEach((error) => console.log(`  - ${error}`));
    });
  }
}

async function ingestRows(supabaseClient, rows, batchSize, updateExisting) {
  let inserted = 0;
  let skipped = 0;
  let failed = 0;
  let upserted = 0;
  const errors = [];

  const batches = Math.ceil(rows.length / batchSize);

  for (let i = 0; i < batches; i += 1) {
    const start = i * batchSize;
    const batch = rows.slice(start, start + batchSize);

    const { data, error } = await supabaseClient
      .from("verses")
      .upsert(batch, {
        onConflict: "locale,translation,book,chapter,verse",
        ignoreDuplicates: !updateExisting,
      })
      .select("id");

    if (error) {
      failed += batch.length;
      errors.push(error.message);
      console.error(`Batch ${i + 1}/${batches} failed:`, error.message);
      continue;
    }

    const affectedCount = Array.isArray(data) ? data.length : 0;
    if (updateExisting) {
      upserted += affectedCount;
      console.log(`Batch ${i + 1}/${batches}: upserted ${affectedCount}`);
    } else {
      inserted += affectedCount;
      skipped += batch.length - affectedCount;
      console.log(
        `Batch ${i + 1}/${batches}: inserted ${affectedCount}, skipped ${batch.length - affectedCount}`,
      );
    }
  }

  return { inserted, skipped, failed, errors, upserted, updateExisting };
}

function printIngestSummary(summary, totalRows) {
  console.log("Ingest summary:");
  console.log("  Total rows:", totalRows);
  if (summary.updateExisting) {
    console.log("  Upserted (inserted/updated):", summary.upserted);
  } else {
    console.log("  Inserted:", summary.inserted);
    console.log("  Skipped (duplicates):", summary.skipped);
  }
  console.log("  Failed:", summary.failed);
  if (summary.errors.length > 0) {
    console.log("  Sample errors:");
    summary.errors.slice(0, SAMPLE_ERROR_LIMIT).forEach((error) => {
      console.log(`    - ${error}`);
    });
  }
}

async function runSanityChecks(supabaseClient) {
  const checks = {
    ok: true,
    count: 0,
    missingAnchors: [],
    duplicates: [],
    emptyVerseText: 0,
    emptyBook: 0,
  };

  const { count, error: countError } = await supabaseClient
    .from("verses")
    .select("id", { count: "exact", head: true })
    .eq("locale", "en")
    .eq("translation", "NIV");

  if (countError) {
    checks.ok = false;
    console.error("Count check failed:", countError.message);
  } else {
    checks.count = count ?? 0;
  }

  const anchors = [
    "Psalms 23:1",
    "John 3:16",
    "Philippians 4:6",
    "1 Corinthians 13:4",
    "Matthew 11:28",
  ];

  const { data: anchorRows, error: anchorError } = await supabaseClient
    .from("verses")
    .select("canonical_ref")
    .eq("locale", "en")
    .eq("translation", "NIV")
    .in("canonical_ref", anchors);

  if (anchorError) {
    checks.ok = false;
    console.error("Anchor check failed:", anchorError.message);
  } else {
    const found = new Set(
      (anchorRows ?? []).map((row) => row.canonical_ref),
    );
    checks.missingAnchors = anchors.filter((anchor) => !found.has(anchor));
    if (checks.missingAnchors.length > 0) {
      checks.ok = false;
    }
  }

  const { data: verses, error: versesError } = await supabaseClient
    .from("verses")
    .select("locale, translation, book, chapter, verse, canonical_ref, verse_text")
    .eq("locale", "en")
    .eq("translation", "NIV");

  if (versesError) {
    checks.ok = false;
    console.error("Duplicate check failed:", versesError.message);
  } else {
    const identityCounts = new Map();
    verses.forEach((row) => {
      const key = `${row.locale}|${row.translation}|${row.book}|${row.chapter}|${row.verse}`;
      identityCounts.set(key, (identityCounts.get(key) ?? 0) + 1);
      if (!row.verse_text || !row.verse_text.trim()) {
        checks.emptyVerseText += 1;
      }
      if (!row.book || !row.book.trim()) {
        checks.emptyBook += 1;
      }
    });
    identityCounts.forEach((count, key) => {
      if (count > 1) {
        checks.duplicates.push({ key, count });
      }
    });
    if (checks.duplicates.length > 0) {
      checks.ok = false;
    }
    if (checks.emptyVerseText > 0 || checks.emptyBook > 0) {
      checks.ok = false;
    }
  }

  return checks;
}

function printSanityChecks(checks) {
  console.log("Sanity checks:");
  console.log(`  Count (en/NIV): ${checks.count}`);
  if (checks.missingAnchors.length === 0) {
    console.log("  Anchor verses: OK");
  } else {
    console.log("  Anchor verses missing:", checks.missingAnchors.join(", "));
  }
  if (checks.duplicates.length === 0) {
    console.log("  Duplicate identity check: OK");
  } else {
    console.log("  Duplicate identity rows:", checks.duplicates.length);
  }
  if (checks.emptyVerseText === 0) {
    console.log("  Empty verse_text check: OK");
  } else {
    console.log(`  Empty verse_text rows: ${checks.emptyVerseText}`);
  }
  if (checks.emptyBook === 0) {
    console.log("  Empty book check: OK");
  } else {
    console.log(`  Empty book rows: ${checks.emptyBook}`);
  }
}
