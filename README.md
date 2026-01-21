This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quiet Invite Email (Task D)

The daily invite cron hits `GET /api/cron/quiet-invite` and sends pairing-aware emails via a pluggable provider.

Required env vars:

- `CRON_SECRET` (auth for the cron endpoint)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL` (e.g. `https://quiet-curation-web.vercel.app`)
- `FALLBACK_CURATION_ID` (optional, used if no pairing for today)

Email provider options:

- Resend (default):
  - `EMAIL_PROVIDER=resend`
  - `RESEND_API_KEY`
  - `RESEND_FROM` (or `EMAIL_FROM`)
- SendGrid:
  - `EMAIL_PROVIDER=sendgrid`
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM` (or `EMAIL_FROM`)

Local test example:

```bash
curl -i "http://localhost:3000/api/cron/quiet-invite" \
  -H "Authorization: Bearer $CRON_SECRET"
```
