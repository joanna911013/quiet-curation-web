-- RLS policies for profiles (user-scoped).
alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;

create policy "profiles select own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles insert own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles update own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Optional: add admin-wide select policy if needed in future.
