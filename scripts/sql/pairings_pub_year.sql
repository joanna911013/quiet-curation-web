-- Add optional publication year to pairings
alter table public.pairings
  add column if not exists pub_year integer;
