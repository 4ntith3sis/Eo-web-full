import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "seo_slug" varchar;
    ALTER TABLE "layanan_kantor" ADD COLUMN IF NOT EXISTS "catatan_legalitas" varchar;
    ALTER TABLE "layanan_kantor" ADD COLUMN IF NOT EXISTS "link_shopee" varchar;
    ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "cta_label" varchar DEFAULT 'Ambil Promo';
    ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "cta_message" varchar;
    ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "cta_href" varchar;
    CREATE TABLE IF NOT EXISTS "site_settings_homepage_hero_trust_items" (
      "id" varchar PRIMARY KEY NOT NULL,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "site_settings"("id") ON DELETE CASCADE,
      "text" varchar NOT NULL,
      "sort_order" numeric DEFAULT 0
    );
    ALTER TABLE "site_settings_homepage_hero_trust_items" ADD COLUMN IF NOT EXISTS "text" varchar;
    ALTER TABLE "site_settings_homepage_hero_trust_items" ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 0;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_services_title" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_services_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_facilities_title" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_facilities_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_comparison_title" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_comparison_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_promo_title" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_promo_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_title" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_description" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_image_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_image_alt" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_cta_label" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "homepage_shopee_href" varchar;
    ALTER TABLE "site_settings_stats_banner" ADD COLUMN IF NOT EXISTS "icon" varchar DEFAULT 'auto';
    UPDATE "promotions" p
    SET "service_id" = s."id"
    FROM "services" s
    WHERE p."service_id" IS NULL
      AND ((p."title" ILIKE '%virtual office%' AND s."slug" = 'virtual-office')
        OR (p."title" ILIKE '%coworking%' AND s."slug" = 'coworking-space')
        OR (p."title" ILIKE '%meeting%' AND s."slug" = 'meeting-room')
        OR (p."title" ILIKE '%private office%' AND s."slug" = 'private-office'));
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "seo_slug";
    ALTER TABLE "layanan_kantor" DROP COLUMN IF EXISTS "catatan_legalitas";
    ALTER TABLE "layanan_kantor" DROP COLUMN IF EXISTS "link_shopee";
    ALTER TABLE "promotions" DROP COLUMN IF EXISTS "cta_label";
    ALTER TABLE "promotions" DROP COLUMN IF EXISTS "cta_message";
    ALTER TABLE "promotions" DROP COLUMN IF EXISTS "cta_href";
    DROP TABLE IF EXISTS "site_settings_homepage_hero_trust_items";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_services_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_services_description";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_facilities_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_facilities_description";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_comparison_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_comparison_description";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_promo_title";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "homepage_promo_description";
  `)
}
