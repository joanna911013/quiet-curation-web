-- Rename rationale_short -> rationale and remove rationale length constraints.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pairings'
      and column_name = 'rationale_short'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pairings'
      and column_name = 'rationale'
  ) then
    execute 'alter table public.pairings rename column rationale_short to rationale';
  end if;
end $$;

alter table public.pairings
  drop constraint if exists pairings_rationale_min_words;
