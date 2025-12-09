CREATE EXTENSION IF NOT EXISTS "pg_uuidv7"; --> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();
