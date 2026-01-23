-- RLS policies for saved_items (user-scoped).
alter table public.saved_items enable row level security;

drop policy if exists "saved items select own" on public.saved_items;
drop policy if exists "saved items insert own" on public.saved_items;
drop policy if exists "saved items update own" on public.saved_items;
drop policy if exists "saved items delete own" on public.saved_items;

create policy "saved items select own"
  on public.saved_items
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "saved items insert own"
  on public.saved_items
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "saved items update own"
  on public.saved_items
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "saved items delete own"
  on public.saved_items
  for delete
  to authenticated
  using (user_id = auth.uid());
