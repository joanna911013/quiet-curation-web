-- Ensure pgvector is available.
create extension if not exists vector;

-- Ensure one embedding per verse for idempotent upserts.
create unique index if not exists verse_embeddings_verse_id_key
  on public.verse_embeddings (verse_id);

-- Vector index for cosine similarity search.
create index if not exists verse_embeddings_embedding_ivfflat
  on public.verse_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

analyze public.verse_embeddings;
