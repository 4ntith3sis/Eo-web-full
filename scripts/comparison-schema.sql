CREATE TABLE IF NOT EXISTS comparison_rows (
  id serial PRIMARY KEY, feature varchar NOT NULL, easyoffice boolean NOT NULL DEFAULT false,
  typical boolean NOT NULL DEFAULT false, sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS comparison_rows_id integer;
