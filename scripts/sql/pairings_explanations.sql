-- Add literature explanations column (optional).
alter table public.pairings
  add column if not exists explanations text;

alter table public.pairings
  drop constraint if exists pairings_explanations_word_count;
