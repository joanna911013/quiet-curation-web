-- Enforce app-level memo limit (160 chars) at DB level as well.
-- Safe to run multiple times.

alter table public.emotion_events
  drop constraint if exists emotion_events_memo_short_max_len;

alter table public.emotion_events
  add constraint emotion_events_memo_short_max_len
  check (
    memo_short is null
    or char_length(memo_short) <= 160
  );
