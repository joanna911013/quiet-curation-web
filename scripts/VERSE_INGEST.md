# Verse Ingestion Pipeline (Idempotent)

This script loads Day 2 verse data into `verses` using idempotent upserts.

## Prereqs

1) Apply the unique identity index (and dedupe) before ingesting:

```
psql "$DATABASE_URL" -f scripts/sql/verses_identity_unique.sql
```

2) Set env vars:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Input format

JSON or CSV with columns:

- `locale` (string)
- `translation` (string, must be "NIV")
- `book` (Title Case, e.g. "1 Corinthians")
- `chapter` (int)
- `verse` (int)
- `canonical_ref` (string, must be "{book} {chapter}:{verse}")
- `verse_text` (string)
- `text` (string, optional legacy field; used if `verse_text` is missing)

Notes:
- Text fields are trimmed and internal whitespace is collapsed to single spaces.
- If `verse_text` is missing, the `text` field is used as the fallback.
- The resolved verse text is stored in `verse_text`.

## Run

```
node scripts/ingest-verses.mjs --input ./path/to/verses.json
```

Optional flags:
- `--batch-size 100`
- `--dry-run`
- `--update-existing` (upsert and overwrite existing rows)

## Output

The script prints:
- validation summary (valid/rejected rows + sample errors)
- ingest summary (inserted/skipped/failed)
- sanity checks (count, anchors, duplicates, empty fields)

## Idempotency

Safe to rerun. The unique identity constraint and `upsert` with
`ignoreDuplicates` prevent duplicates.
