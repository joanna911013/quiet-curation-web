-- Dedupe verses on identity and add unique constraint.
-- Safe to run multiple times (idempotent).

-- 1) Remove duplicate rows, keep the earliest created_at (tie-breaker: lowest id).
WITH ranked AS (
  SELECT
    id,
    locale,
    translation,
    book,
    chapter,
    verse,
    row_number() OVER (
      PARTITION BY locale, translation, book, chapter, verse
      ORDER BY created_at ASC, id ASC
    ) AS rn
  FROM public.verses
)
DELETE FROM public.verses
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2) Add unique index on identity.
CREATE UNIQUE INDEX IF NOT EXISTS verses_identity_unique
ON public.verses (locale, translation, book, chapter, verse);

-- 3) Duplicate check (should return 0 rows).
SELECT
  locale,
  translation,
  book,
  chapter,
  verse,
  COUNT(*) AS duplicate_count
FROM public.verses
GROUP BY locale, translation, book, chapter, verse
HAVING COUNT(*) > 1;
