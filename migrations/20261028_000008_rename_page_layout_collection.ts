import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE IF EXISTS "homepage_layout" RENAME TO "page_layout"`)
  await db.execute(sql`ALTER TABLE IF EXISTS "payload_locked_documents_rels" RENAME COLUMN "homepage_layout_id" TO "page_layout_id"`)
  await db.execute(sql`ALTER INDEX IF EXISTS "payload_locked_documents_rels_homepage_layout_id_idx" RENAME TO "payload_locked_documents_rels_page_layout_id_idx"`)
  await db.execute(sql`ALTER TABLE IF EXISTS "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_homepage_layout_fk" TO "payload_locked_documents_rels_page_layout_fk"`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE IF EXISTS "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_page_layout_fk" TO "payload_locked_documents_rels_homepage_layout_fk"`)
  await db.execute(sql`ALTER INDEX IF EXISTS "payload_locked_documents_rels_page_layout_id_idx" RENAME TO "payload_locked_documents_rels_homepage_layout_id_idx"`)
  await db.execute(sql`ALTER TABLE IF EXISTS "payload_locked_documents_rels" RENAME COLUMN "page_layout_id" TO "homepage_layout_id"`)
  await db.execute(sql`ALTER TABLE IF EXISTS "page_layout" RENAME TO "homepage_layout"`)
}
