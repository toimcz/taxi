CREATE TYPE "public"."email_status" AS ENUM('CREATED', 'SENT', 'DELIVERED', 'FIRST_OPENING', 'OPENED', 'CLICKED', 'INVALID_EMAIL');--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"provider_id" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"subject" text NOT NULL,
	"email_status" "email_status" NOT NULL,
	"created_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "emails_provider_id_index" ON "emails" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "emails_email_index" ON "emails" USING btree ("email");--> statement-breakpoint
CREATE INDEX "emails_status_index" ON "emails" USING btree ("email_status");--> statement-breakpoint
CREATE INDEX "emails_created_by_id_index" ON "emails" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "emails_created_at_index" ON "emails" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "emails_status_created_at_index" ON "emails" USING btree ("email_status","created_at");--> statement-breakpoint
CREATE INDEX "emails_user_created_at_index" ON "emails" USING btree ("created_by_id","created_at");--> statement-breakpoint
CREATE INDEX "emails_email_status_index" ON "emails" USING btree ("email","email_status");