CREATE TABLE IF NOT EXISTS homepage_layout (
  id serial PRIMARY KEY,
  name varchar NOT NULL,
  layout jsonb NOT NULL,
  status varchar NOT NULL DEFAULT 'draft',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS homepage_layout_id integer;
