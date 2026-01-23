-- Remove old vector search signature if it exists.
drop function if exists public.search_verses(vector, text, int, float);

-- Full-text search index for verse_text.
create index if not exists verses_verse_text_fts_idx
  on public.verses
  using gin (to_tsvector('english', coalesce(verse_text, '')));

create or replace function public.search_verses(
  query_text text,
  locale text,
  translation text default 'NIV',
  top_k int default 5
)
returns table (
  verse_id uuid,
  canonical_ref text,
  score float
)
language sql
stable
set search_path = public
as $$
  with base as (
    select
      v.id,
      coalesce(v.canonical_ref, v.book || ' ' || v.chapter || ':' || v.verse) as canonical_ref,
      coalesce(v.verse_text, '') as body,
      to_tsvector('english', coalesce(v.verse_text, '')) as document,
      plainto_tsquery('english', btrim(search_verses.query_text)) as query
    from verses v
    where search_verses.query_text is not null
      and btrim(search_verses.query_text) <> ''
      and v.locale = search_verses.locale
      and v.translation = search_verses.translation
      and coalesce(v.verse_text, '') <> ''
  )
  select
    base.id as verse_id,
    base.canonical_ref,
    case
      when base.document @@ base.query then ts_rank(base.document, base.query)
      when base.body ilike '%' || search_verses.query_text || '%' then 0.5
      when length(search_verses.query_text) >= 4
        and base.body ilike '%' || left(search_verses.query_text, 4) || '%' then 0.1
      else 0
    end as score
  from base
  where base.document @@ base.query
     or base.body ilike '%' || search_verses.query_text || '%'
     or (length(search_verses.query_text) >= 4
        and base.body ilike '%' || left(search_verses.query_text, 4) || '%')
  order by score desc
  limit greatest(coalesce(search_verses.top_k, 5), 1);
$$;
