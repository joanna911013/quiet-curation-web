# Quiet Curation Web (MVP)

Last updated: 2026-02-14

Quiet Curation Web is the MVP web app for a calm daily ritual:

1. Read one literature excerpt paired with one Bible verse.
2. View why the pairing was curated.
3. Optionally bookmark and log one daily emotion.
4. Receive the pairing by weekday email invite.

## Current MVP Status

The following is implemented and in use:

- Email magic-link auth with Supabase (`/` sign-in, callback handling, redirect-safe flow).
- Protected app shell for signed-in users (`/today`, `/c/[id]`, `/saved`, `/emotion`, `/profile`).
- Daily pairing fetch from `pairings` (approved-only), keyed by Asia/Seoul date and locale.
- Safe fallback logic when today pairing is missing (`is_safe_set` pairing, then fallback curation id for cron).
- Pairing detail view with literature + verse + rationale/explanations.
- Save/unsave bookmarks to `saved_items` and a Saved list page.
- Emotion logging (feature-flagged) to `emotion_events` with one entry per user/day.
- Admin tools for pairings (`/admin`, `/admin/pairings`, edit/new, approve/unapprove, set-as-today).
- Weekday cron email pipeline at `GET /api/cron/quiet-invite` with retries and provider abstraction.
- Marketing pages (`/landing`, `/subscribe`) and basic analytics event hooks.
- Operational check pages for RLS/search verification (`/whoami`, `/pairings-check`, `/verse-check`, `/search-check`, `/saved-rls-check`).

Current known limitations:

- `/subscribe` form UI is placeholder-only (not wired to real opt-in persistence yet).
- Internationalization is partially wired (`en`, `ko`) but most app copy is still English.
- No automated test suite is included yet (manual route/script checks are used).

## Product Scope

This repository contains both user-facing and operator-facing surfaces:

- User-facing app: `/`, `/today`, `/c/[id]`, `/saved`, `/emotion`, `/profile`
- Marketing: `/landing`, `/subscribe`
- Admin/ops: `/admin`, `/admin/pairings`, `/api/cron/quiet-invite`, plus check/debug routes

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Supabase (Auth + Postgres + RLS)
- `next-intl` (locale plumbing)
- Tailwind CSS 4
- Email providers: `dryrun`, `resend`, `sendgrid`

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Core app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (used by auth callback links in client flow)

Server/ops:

- `SUPABASE_SERVICE_ROLE_KEY` (cron/scripts; also used by some admin fallback reads)
- `SITE_URL` (base URL for invite links and scripts)
- `CRON_SECRET` (required auth for `/api/cron/quiet-invite`)
- `FALLBACK_CURATION_ID` (optional final fallback when no today/safe-set pairing exists)

Email sending:

- `EMAIL_PROVIDER` = `dryrun` | `resend` | `sendgrid`
- `EMAIL_DRY_RUN=true` (optional)
- `RESEND_API_KEY`, `RESEND_FROM` (or `EMAIL_FROM`) for Resend
- `SENDGRID_API_KEY`, `SENDGRID_FROM` (or `EMAIL_FROM`) for SendGrid

Feature flags / debug:

- `EMOTION_LOGGING_ENABLED=true` (or `NEXT_PUBLIC_EMOTION_LOGGING_ENABLED=true`)
- `CRON_DEBUG=true` (optional extra cron response metadata)
- `OPENAI_API_KEY` (optional, only for embedding script mode)

## Data + SQL Notes

The app expects existing Supabase tables for core domain data (`pairings`, `verses`, `saved_items`, `profiles`, etc.).
Incremental SQL scripts are in `scripts/sql/` for policy and schema updates, including:

- `emotion_events.sql`
- `invite_deliveries.sql` and `invite_deliveries_rls.sql`
- `profiles_notification_opt_in.sql`
- `profiles_rls.sql`, `saved_items_rls.sql`, `pairings_admin_rls.sql`
- `verse_search_text.sql`, `verse_embeddings_index.sql`
- Pairing/verse cleanup and constraint scripts

## Curation + Delivery Workflow

1. Prepare verse data:

```bash
node scripts/ingest-verses.mjs --input ./scripts/data/verses_en_niv_day2.json
```

2. Optional semantic embedding:

```bash
node scripts/embed-verses.mjs --locale en --translation NIV --mode openai
```

3. Create and approve pairings in admin UI:

- `/admin/pairings/new` then Approve in editor or list actions

4. Send invites:

- Vercel cron is configured in `vercel.json` as `0 0 * * 1-5` (weekday 00:00 UTC = 09:00 KST).
- Local/manual trigger:

```bash
curl -i "http://localhost:3000/api/cron/quiet-invite" \
  -H "Authorization: Bearer $CRON_SECRET"
```

5. Send one test invite:

```bash
node scripts/send-test-invite.mjs --email you@example.com --base-url http://localhost:3000
```

## Notes For Contributors

- This repo currently uses manual verification through pages and scripts; please test changed flows end-to-end when touching auth, pairings, or cron/email.
- If you add new protected data access, include corresponding RLS updates under `scripts/sql/`.
