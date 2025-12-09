CREATE TABLE "services" (
	"id" uuid PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"image" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "services_status_index" ON "services" USING btree ("status");--> statement-breakpoint
CREATE INDEX "services_position_idx" ON "services" USING btree ("position");--> statement-breakpoint
CREATE INDEX "services_slug_idx" ON "services" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "services_active_position_idx" ON "services" USING btree ("status","position");--> statement-breakpoint
CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "services_status_updated_idx" ON "services" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "services_title_idx" ON "services" USING btree ("title");