CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar NOT NULL,
	"value" varchar NOT NULL,
	"dev_value" varchar NOT NULL,
	"description" text NOT NULL,
	"editable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX "configs_editable_idx" ON "settings" USING btree ("editable");--> statement-breakpoint
CREATE INDEX "configs_created_at_idx" ON "settings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "configs_updated_at_idx" ON "settings" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "configs_editable_key_idx" ON "settings" USING btree ("editable","key");