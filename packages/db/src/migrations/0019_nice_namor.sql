CREATE TABLE "distances" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"from_place_id" text NOT NULL,
	"to_place_id" text NOT NULL,
	"distance" integer NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "distances_route_unique" UNIQUE("from_place_id","to_place_id")
);
--> statement-breakpoint
CREATE INDEX "distances_from_place_id_idx" ON "distances" USING btree ("from_place_id");--> statement-breakpoint
CREATE INDEX "distances_to_place_id_idx" ON "distances" USING btree ("to_place_id");--> statement-breakpoint
CREATE INDEX "distances_created_at_idx" ON "distances" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "distances_route_idx" ON "distances" USING btree ("from_place_id","to_place_id");--> statement-breakpoint
CREATE INDEX "distances_reverse_route_idx" ON "distances" USING btree ("to_place_id","from_place_id");