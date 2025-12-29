CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	CONSTRAINT "questions_question_not_empty_check" CHECK (LENGTH(TRIM("questions"."question")) > 0),
	CONSTRAINT "questions_answer_not_empty_check" CHECK (LENGTH(TRIM("questions"."answer")) > 0),
	CONSTRAINT "questions_question_length_check" CHECK (LENGTH("questions"."question") <= 500),
	CONSTRAINT "questions_answer_length_check" CHECK (LENGTH("questions"."answer") <= 5000)
);
--> statement-breakpoint
CREATE TABLE "questions_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" text NOT NULL,
	"description" varchar(500) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	CONSTRAINT "questions_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_questions_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."questions_categories"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_category_id_idx" ON "questions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "questions_status_category_idx" ON "questions" USING btree ("status","category_id");--> statement-breakpoint
CREATE INDEX "questions_question_text_idx" ON "questions" USING gin (to_tsvector('english', "question"));--> statement-breakpoint
CREATE INDEX "questions_categories_order_idx" ON "questions_categories" USING btree ("order");--> statement-breakpoint
CREATE INDEX "questions_categories_name_idx" ON "questions_categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "questions_categories_status_idx" ON "questions_categories" USING btree ("status");