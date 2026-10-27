import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services"
      ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 9999 NOT NULL;
    UPDATE "services"
      SET "sort_order" = CASE "slug"
        WHEN 'virtual-office' THEN 10
        WHEN 'coworking-space' THEN 20
        WHEN 'meeting-room' THEN 30
        WHEN 'private-office' THEN 40
        ELSE 9999
      END;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "sort_order";
  `)
}
