-- Sync verse_text from legacy text (if present), then drop legacy column.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'verses'
      and column_name = 'text'
  ) then
    update public.verses
    set verse_text = text
    where text is not null
      and (verse_text is null or char_length(text) > char_length(verse_text));

    alter table public.verses
      drop column text;
  end if;
end $$;
