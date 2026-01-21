create table if not exists public.invite_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  delivery_date date not null,
  channel text not null default 'email',
  curation_id text not null,
  status text not null default 'pending',
  error_message text,
  retry_count int not null default 0,
  last_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invite_deliveries
  add column if not exists channel text not null default 'email',
  add column if not exists curation_id text not null default '',
  add column if not exists status text not null default 'pending',
  add column if not exists error_message text,
  add column if not exists retry_count int not null default 0,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop index if exists invite_deliveries_user_date_channel_key;

create unique index if not exists invite_deliveries_user_date_key
  on public.invite_deliveries (user_id, delivery_date);

alter table public.invite_deliveries enable row level security;

-- Dedupe check:
-- select user_id, delivery_date, count(*) from public.invite_deliveries
-- group by user_id, delivery_date having count(*) > 1;
