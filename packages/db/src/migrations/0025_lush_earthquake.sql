CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(256) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"partner_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fleets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"plate" varchar(50) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"stk" timestamp,
	"partner_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "fleets_name_check" CHECK (length(trim("fleets"."name")) >= 1 AND length(trim("fleets"."name")) <= 256),
	CONSTRAINT "fleets_plate_check" CHECK (length(trim("fleets"."plate")) >= 3 AND length(trim("fleets"."plate")) <= 50 AND "fleets"."plate" ~ '^[A-Z0-9 ]+$'),
	CONSTRAINT "fleets_stk_check" CHECK ("fleets"."stk" IS NULL OR "fleets"."stk" >= current_date),
	CONSTRAINT "fleets_created_at_check" CHECK ("fleets"."created_at" <= now()),
	CONSTRAINT "fleets_updated_at_check" CHECK ("fleets"."updated_at" >= "fleets"."created_at")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(256),
	"phone" varchar(50),
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fleets" ADD CONSTRAINT "fleets_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "drivers_partner_id_idx" ON "drivers" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "drivers_status_idx" ON "drivers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "drivers_partner_status_idx" ON "drivers" USING btree ("partner_id","status");--> statement-breakpoint
CREATE INDEX "drivers_email_idx" ON "drivers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "drivers_name_idx" ON "drivers" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE UNIQUE INDEX "drivers_phone_partner_id_idx" ON "drivers" USING btree ("phone","partner_id");--> statement-breakpoint
CREATE INDEX "fleets_partner_id_idx" ON "fleets" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "fleets_status_idx" ON "fleets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fleets_plate_idx" ON "fleets" USING btree ("plate");--> statement-breakpoint
CREATE INDEX "fleets_stk_idx" ON "fleets" USING btree ("stk");--> statement-breakpoint
CREATE INDEX "fleets_partner_status_idx" ON "fleets" USING btree ("partner_id","status");--> statement-breakpoint
CREATE INDEX "fleets_partner_stk_idx" ON "fleets" USING btree ("partner_id","stk");--> statement-breakpoint
CREATE INDEX "fleets_created_at_idx" ON "fleets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "partners_name_idx" ON "partners" USING btree ("name");--> statement-breakpoint
CREATE INDEX "partners_email_idx" ON "partners" USING btree ("email");--> statement-breakpoint
CREATE INDEX "partners_status_idx" ON "partners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "partners_status_name_idx" ON "partners" USING btree ("status","name");--> statement-breakpoint
CREATE INDEX "partners_status_created_at_idx" ON "partners" USING btree ("status","created_at");