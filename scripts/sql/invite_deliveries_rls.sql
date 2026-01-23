-- RLS for invite_deliveries (service-only access).
alter table public.invite_deliveries enable row level security;

-- Drop all existing policies on invite_deliveries to prevent user access.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'invite_deliveries'
  loop
    execute format('drop policy if exists %I on public.invite_deliveries', pol.policyname);
  end loop;
end $$;

-- No policies are created; service role bypasses RLS for cron writes.
