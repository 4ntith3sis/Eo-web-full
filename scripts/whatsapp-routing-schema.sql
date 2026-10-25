ALTER TABLE service_offices ADD COLUMN IF NOT EXISTS whatsapp_numbers jsonb;
CREATE TABLE IF NOT EXISTS service_offices_whatsapp_numbers (
  id varchar PRIMARY KEY,
  _order integer NOT NULL DEFAULT 0,
  _parent_id integer NOT NULL REFERENCES service_offices(id) ON DELETE CASCADE,
  label varchar,
  number varchar NOT NULL,
  active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS service_offices_whatsapp_numbers_parent_idx ON service_offices_whatsapp_numbers (_parent_id);
