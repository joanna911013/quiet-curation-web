create table if not exists public.emotion_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  event_date date not null,
  emotion_primary text not null,
  memo_short text,
  pairing_id uuid references public.pairings(id),
  curation_id uuid references public.items(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.emotion_events
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists event_date date,
  add column if not exists emotion_primary text,
  add column if not exists memo_short text,
  add column if not exists pairing_id uuid references public.pairings(id),
  add column if not exists curation_id uuid references public.items(id),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop index if exists emotion_events_user_date_key;

create unique index if not exists emotion_events_user_date_key
  on public.emotion_events (user_id, event_date);

alter table public.emotion_events enable row level security;

drop policy if exists "emotion events select own" on public.emotion_events;
drop policy if exists "emotion events insert own" on public.emotion_events;
drop policy if exists "emotion events update own" on public.emotion_events;
drop policy if exists "emotion events delete own" on public.emotion_events;

create policy "emotion events select own"
  on public.emotion_events
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "emotion events insert own"
  on public.emotion_events
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "emotion events update own"
  on public.emotion_events
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "emotion events delete own"
  on public.emotion_events
  for delete
  to authenticated
  using (user_id = auth.uid());

alter table public.emotion_events
  drop constraint if exists emotion_events_memo_length_check;

alter table public.emotion_events
  add constraint emotion_events_memo_length_check
  check (memo_short is null or char_length(memo_short) <= 160);
