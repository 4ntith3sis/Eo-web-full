ALTER TABLE service_offices ADD COLUMN IF NOT EXISTS tagline varchar;
ALTER TABLE service_offices ADD COLUMN IF NOT EXISTS starting_price varchar;
ALTER TABLE service_offices ADD COLUMN IF NOT EXISTS image varchar;
ALTER TABLE service_offices ADD COLUMN IF NOT EXISTS image_alt varchar;
CREATE TABLE IF NOT EXISTS service_offices_facilities (
  _order integer NOT NULL, _parent_id integer NOT NULL REFERENCES service_offices(id) ON DELETE CASCADE,
  id varchar PRIMARY KEY, icon varchar, title varchar, description varchar
);
CREATE TABLE IF NOT EXISTS service_offices_faqs (
  _order integer NOT NULL, _parent_id integer NOT NULL REFERENCES service_offices(id) ON DELETE CASCADE,
  id varchar PRIMARY KEY, question varchar, answer varchar
);
CREATE TABLE IF NOT EXISTS service_offices_gallery (
  _order integer NOT NULL, _parent_id integer NOT NULL REFERENCES service_offices(id) ON DELETE CASCADE,
  id varchar PRIMARY KEY, src varchar, alt varchar
);
CREATE TABLE IF NOT EXISTS media (
  id serial PRIMARY KEY, alt varchar, filename varchar NOT NULL, mime_type varchar NOT NULL DEFAULT 'image/webp',
  filesize integer, width integer, height integer, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS media_filename_unique ON media(filename);
CREATE TABLE IF NOT EXISTS promotions (
  id serial PRIMARY KEY, badge varchar, title varchar NOT NULL, description varchar, period varchar,
  service_id integer REFERENCES services(id) ON DELETE SET NULL, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS testimonials (
  id serial PRIMARY KEY, name varchar NOT NULL, company varchar, quote varchar NOT NULL, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
