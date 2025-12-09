CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"top" boolean DEFAULT false NOT NULL,
	"bottom" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug"),
	CONSTRAINT "pages_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "pages_title_idx" ON "pages" USING btree ("title");--> statement-breakpoint
CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pages_slug_title_idx" ON "pages" USING btree ("slug","title");--> statement-breakpoint
CREATE INDEX "pages_content_search_idx" ON "pages" USING gin (to_tsvector('english', "content"));