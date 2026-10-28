import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "manfaat_title" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "manfaat_description" varchar;

    CREATE TABLE IF NOT EXISTS "services_keunggulan_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" varchar DEFAULT 'sparkles',
      "title" varchar NOT NULL,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "services_manfaat_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" varchar DEFAULT 'sparkles',
      "title" varchar NOT NULL,
      "description" varchar
    );

    CREATE INDEX IF NOT EXISTS "services_keunggulan_items_parent_idx" ON "services_keunggulan_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_manfaat_items_parent_idx" ON "services_manfaat_items" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_keunggulan_items";
    DROP TABLE IF EXISTS "services_manfaat_items";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "manfaat_title";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "manfaat_description";
  `)
}
