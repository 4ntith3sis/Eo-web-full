import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the public URL used by Puck pages.
 *
 * Existing records are assigned deterministic, non-conflicting routes before
 * the column is made required. The oldest record keeps `/` as the legacy
 * homepage layout; subsequent records receive an internal fallback route that
 * editors can change later in the Puck manager.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "homepage_layout"
      ADD COLUMN IF NOT EXISTS "route" varchar;

    WITH ordered_layouts AS (
      SELECT "id", row_number() OVER (ORDER BY "created_at" ASC NULLS LAST, "id" ASC) AS position
      FROM "homepage_layout"
      WHERE "route" IS NULL
    )
    UPDATE "homepage_layout" AS layouts
    SET "route" = CASE
      WHEN ordered_layouts.position = 1 THEN '/'
      ELSE '/puck-page-' || layouts."id"::text
    END
    FROM ordered_layouts
    WHERE layouts."id" = ordered_layouts."id";

    ALTER TABLE "homepage_layout"
      ALTER COLUMN "route" SET NOT NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS "homepage_layout_route_idx"
      ON "homepage_layout" USING btree ("route");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "homepage_layout_route_idx";
    ALTER TABLE "homepage_layout" DROP COLUMN IF EXISTS "route";
  `)
}
