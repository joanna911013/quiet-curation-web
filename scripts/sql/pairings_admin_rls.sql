-- Admin RLS policies for pairings (Day 4)
-- Allows admins (profiles.role = 'admin') to read drafts and write pairings.

alter table public.pairings enable row level security;

create policy "admin read pairings"
  on public.pairings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "admin insert pairings"
  on public.pairings
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "admin update pairings"
  on public.pairings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Optional if you want admins to delete pairings
-- create policy "admin delete pairings"
--   on public.pairings
--   for delete
--   to authenticated
--   using (
--     exists (
--       select 1 from public.profiles p
--       where p.id = auth.uid() and p.role = 'admin'
--     )
--   );
