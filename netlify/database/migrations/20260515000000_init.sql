CREATE TABLE bingo_fact (
  id        SERIAL PRIMARY KEY,
  fact_text TEXT NOT NULL
);

CREATE TABLE bingo_card (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_name TEXT        NOT NULL,
  bingo_facts  JSONB       NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
