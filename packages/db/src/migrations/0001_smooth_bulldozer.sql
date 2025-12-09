CREATE TABLE "postcategories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "postcategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"content" text NOT NULL,
	"public" boolean DEFAULT true NOT NULL,
	"photo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"publish_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"category_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"updated_by_id" uuid NOT NULL,
	"deleted_by_id" uuid,
	CONSTRAINT "posts_category_slug_unique" UNIQUE("category_id","slug")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_postcategories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."postcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_deleted_by_id_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "postcategories_slug_index" ON "postcategories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "postcategories_name_index" ON "postcategories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "postcategories_status_index" ON "postcategories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "postcategories_created_at_index" ON "postcategories" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "postcategories_updated_at_index" ON "postcategories" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "postcategories_status_created_at_index" ON "postcategories" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "postcategories_status_name_index" ON "postcategories" USING btree ("status","name");--> statement-breakpoint
CREATE INDEX "posts_slug_index" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_public_index" ON "posts" USING btree ("public");--> statement-breakpoint
CREATE INDEX "posts_created_at_index" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_updated_at_index" ON "posts" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "posts_publish_at_index" ON "posts" USING btree ("publish_at");--> statement-breakpoint
CREATE INDEX "posts_expires_at_index" ON "posts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "posts_category_id_index" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "posts_created_by_id_index" ON "posts" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "posts_updated_by_id_index" ON "posts" USING btree ("updated_by_id");--> statement-breakpoint
CREATE INDEX "posts_deleted_by_id_index" ON "posts" USING btree ("deleted_by_id");--> statement-breakpoint
CREATE INDEX "posts_public_publish_at_index" ON "posts" USING btree ("public","publish_at");--> statement-breakpoint
CREATE INDEX "posts_category_public_index" ON "posts" USING btree ("category_id","public");--> statement-breakpoint
CREATE INDEX "posts_category_publish_at_index" ON "posts" USING btree ("category_id","publish_at");--> statement-breakpoint
CREATE INDEX "posts_public_created_at_index" ON "posts" USING btree ("public","created_at");--> statement-breakpoint
CREATE INDEX "posts_created_by_created_at_index" ON "posts" USING btree ("created_by_id","created_at");