import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_benefits" CASCADE;
    DROP TABLE IF EXISTS "services_features" CASCADE;
    DROP TABLE IF EXISTS "layanan_kantor_keunggulan" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Legacy content is intentionally not recreated automatically. Restore it from the database backup if needed.
  await db.execute(sql``)
}
