# Verse Embeddings + Search

## Env vars

The scripts load `.env.local` automatically. Required:

- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (optional for Week 2 Option C; embedding will be skipped if missing)

## DB setup (run once)

In Supabase SQL editor:

- `scripts/sql/verse_embeddings_index.sql` (kept for later vector search)
- `scripts/sql/verse_search_text.sql` (keyword search RPC + index)

## Generate embeddings (optional)

```bash
cd quiet-curation-web
node scripts/embed-verses.mjs --locale en --translation NIV --mode openai
```

Options:

- `--batch-size 50`
- `--model text-embedding-3-small`
- `--limit 25` (useful for smoke tests)
- `--dry-run`
- `--mode openai` (required to write embeddings)
- `--mode skip` (default; skips OpenAI calls)

Safe to rerun: existing `verse_id` rows are skipped via upsert.

If `OPENAI_API_KEY` is missing, the script exits successfully and does not write embeddings.

## Search sanity run (keyword)

```bash
cd quiet-curation-web
node scripts/search-verses.mjs
```

Defaults to queries: `shepherd`, `rest`, `anxiety`.

Options:

- `--query "your term"` (repeatable)
- `--top-k 5`
- `--translation NIV`
