-- Remove excerpt length limits on public.pairings.
-- Safe for either legacy `excerpt` column or current `literature_text`.

do $$
declare
  target_column text;
  c record;
begin
  -- 1) Widen excerpt-like columns to TEXT.
  foreach target_column in array array['excerpt', 'literature_text']
  loop
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'pairings'
        and column_name = target_column
    ) then
      execute format(
        'alter table public.pairings alter column %I type text',
        target_column
      );
    end if;
  end loop;

  -- 2) Drop only length-related CHECK constraints on excerpt-like columns.
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.pairings'::regclass
      and contype = 'c'
      and (
        conname ilike '%excerpt%'
        or conname ilike '%literature_text%'
        or conname ilike '%char%'
        or conname ilike '%length%'
      )
      and (
        pg_get_constraintdef(oid) ilike '%excerpt%'
        or pg_get_constraintdef(oid) ilike '%literature_text%'
      )
      and (
        pg_get_constraintdef(oid) ilike '%char_length%'
        or pg_get_constraintdef(oid) ilike '%length(%'
      )
  loop
    execute format(
      'alter table public.pairings drop constraint if exists %I',
      c.conname
    );
  end loop;
end $$;
