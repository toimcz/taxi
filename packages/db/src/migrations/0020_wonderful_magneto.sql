CREATE TABLE "errors" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"status_code" integer NOT NULL,
	"code" text NOT NULL,
	"message" text NOT NULL,
	"error_type" text NOT NULL,
	"path" text NOT NULL,
	"method" varchar(10) NOT NULL,
	"stack" text
);
