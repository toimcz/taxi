ALTER TABLE "ride_details" DROP CONSTRAINT "ride_details_quote_id_quotes_id_fk";
--> statement-breakpoint
ALTER TABLE "ride_details" ALTER COLUMN "quote_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ride_details" ADD CONSTRAINT "ride_details_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE set null ON UPDATE no action;