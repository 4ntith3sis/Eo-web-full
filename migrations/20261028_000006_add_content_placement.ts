import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "faqs" ADD COLUMN IF NOT EXISTS "placement" varchar;
    ALTER TABLE "comparison_rows" ADD COLUMN IF NOT EXISTS "placement" varchar;
    UPDATE "faqs" SET "placement" = CASE WHEN "service_id" IS NULL THEN 'global' ELSE 'service' END WHERE "placement" IS NULL;
    UPDATE "comparison_rows" SET "placement" = CASE WHEN "service_id" IS NULL THEN 'global' ELSE 'service' END WHERE "placement" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "faqs" DROP COLUMN IF EXISTS "placement";
    ALTER TABLE "comparison_rows" DROP COLUMN IF EXISTS "placement";
  `)
}
