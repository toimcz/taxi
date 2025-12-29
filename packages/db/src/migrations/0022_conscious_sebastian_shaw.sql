CREATE TYPE "public"."payment_method_provider" AS ENUM('stripe', 'local');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('CREATED', 'SUCCEEDED', 'FAILED', 'PREPAID', 'CANCELED');--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"admin_name" varchar(100) NOT NULL,
	"description" varchar(160) NOT NULL,
	"provider" "payment_method_provider" NOT NULL,
	"public" boolean DEFAULT true NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"invoice_id" integer,
	"amount" integer NOT NULL,
	"reference_id" varchar(256) DEFAULT '' NOT NULL,
	"currency" char(3) DEFAULT 'czk' NOT NULL,
	"description" varchar(256) NOT NULL,
	"payment_method_id" uuid NOT NULL,
	"payment_intent_id" varchar(256),
	"client_secret" text,
	"vat_rate" smallint DEFAULT 0 NOT NULL,
	"status" "payment_status" DEFAULT 'CREATED' NOT NULL,
	"paid_at" timestamp,
	"due_at" timestamp NOT NULL,
	"billing_details" json NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"cancelled_at" timestamp,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"cancelled_by_id" uuid,
	CONSTRAINT "payments_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_cancelled_by_id_users_id_fk" FOREIGN KEY ("cancelled_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_methods_public_idx" ON "payment_methods" USING btree ("public");--> statement-breakpoint
CREATE INDEX "payment_methods_provider_idx" ON "payment_methods" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "payment_methods_name_idx" ON "payment_methods" USING btree ("name");--> statement-breakpoint
CREATE INDEX "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payment_methods_public_provider_idx" ON "payment_methods" USING btree ("public","provider");--> statement-breakpoint
CREATE INDEX "payment_methods_public_name_idx" ON "payment_methods" USING btree ("public","name");--> statement-breakpoint
CREATE INDEX "payment_methods_status_idx" ON "payment_methods" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_payment_method_idx" ON "payments" USING btree ("payment_method_id");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_reference_id_idx" ON "payments" USING btree ("reference_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payments_due_at_idx" ON "payments" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "payments_paid_at_idx" ON "payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "payments_cancelled_at_idx" ON "payments" USING btree ("cancelled_at");--> statement-breakpoint
CREATE INDEX "payments_created_by_idx" ON "payments" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "payments_updated_by_idx" ON "payments" USING btree ("updated_by_id");--> statement-breakpoint
CREATE INDEX "payments_cancelled_by_idx" ON "payments" USING btree ("cancelled_by_id");--> statement-breakpoint
CREATE INDEX "payments_status_created_at_idx" ON "payments" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "payments_status_due_at_idx" ON "payments" USING btree ("status","due_at");--> statement-breakpoint
CREATE INDEX "payments_payment_method_status_idx" ON "payments" USING btree ("payment_method_id","status");--> statement-breakpoint
CREATE INDEX "payments_currency_status_idx" ON "payments" USING btree ("currency","status");--> statement-breakpoint
CREATE INDEX "payments_created_by_status_idx" ON "payments" USING btree ("created_by_id","status");