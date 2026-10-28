import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "comparison_rows"
      ALTER COLUMN "easyoffice" TYPE varchar USING CASE WHEN "easyoffice" THEN 'true' ELSE 'false' END,
      ALTER COLUMN "typical" TYPE varchar USING CASE WHEN "typical" THEN 'true' ELSE 'false' END;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "comparison_rows"
      ALTER COLUMN "easyoffice" TYPE boolean USING ("easyoffice" = 'true'),
      ALTER COLUMN "typical" TYPE boolean USING ("typical" = 'true');
  `)
}
