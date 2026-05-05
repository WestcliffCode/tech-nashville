import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE INDEX "events_event_date_idx" ON "events" USING btree ("event_date");
  CREATE INDEX "_events_v_version_version_event_date_idx" ON "_events_v" USING btree ("version_event_date");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "events_event_date_idx";
  DROP INDEX "_events_v_version_version_event_date_idx";`)
}
