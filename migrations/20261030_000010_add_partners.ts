import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Add the CMS-managed partner logo collection without changing existing tables. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partners" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "logo_id" integer NOT NULL,
      "logo_alt" varchar,
      "href" varchar,
      "sort_order" numeric DEFAULT 0,
      "is_active" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "partners_logo_idx" ON "partners" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "partners_sort_order_idx" ON "partners" USING btree ("sort_order");
    CREATE INDEX IF NOT EXISTS "partners_is_active_idx" ON "partners" USING btree ("is_active");
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk"
        FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
}

/** Data-preserving rollback: intentionally retain the collection table and records. */
export async function down(_args: MigrateDownArgs): Promise<void> {
  // Do not drop partner content during rollback; remove only via an explicit data-retention decision.
}
