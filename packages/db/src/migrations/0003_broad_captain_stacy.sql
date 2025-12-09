CREATE TABLE "bases" (
	"id" uuid PRIMARY KEY NOT NULL,
	"city" varchar(256) NOT NULL,
	"country_id" uuid NOT NULL,
	"place_id" text,
	"koeficient" numeric(5,2) DEFAULT 1 NOT NULL,
	"strength" smallint DEFAULT 0 NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"lat" numeric(10, 6) NOT NULL,
	"lng" numeric(11, 6) NOT NULL,
	CONSTRAINT "bases_city_country_id_unique" UNIQUE("city","country_id")
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"admin_name" varchar(100) NOT NULL,
	"description" varchar(200) NOT NULL,
	"photo" text NOT NULL,
	"price_km" integer NOT NULL,
	"min_price" integer NOT NULL,
	"base_price" integer NOT NULL,
	"per_person" boolean DEFAULT false NOT NULL,
	"pax" smallint NOT NULL,
	"luggage" smallint NOT NULL,
	"types" varchar(256) NOT NULL,
	"deposit" boolean DEFAULT false NOT NULL,
	"surge" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"tags" varchar(100)[] DEFAULT '{}'::varchar[],
	"base_id" uuid NOT NULL,
	CONSTRAINT "cars_pax_check" CHECK ("cars"."pax" >= 1 AND "cars"."pax" <= 100),
	CONSTRAINT "cars_luggage_check" CHECK ("cars"."luggage" >= 0 AND "cars"."luggage" <= 100),
	CONSTRAINT "cars_price_km_check" CHECK ("cars"."price_km" >= 0),
	CONSTRAINT "cars_min_price_check" CHECK ("cars"."min_price" >= 0),
	CONSTRAINT "cars_base_price_check" CHECK ("cars"."base_price" >= 0),
	CONSTRAINT "cars_name_check" CHECK (length(trim("cars"."name")) > 0),
	CONSTRAINT "cars_admin_name_check" CHECK (length(trim("cars"."admin_name")) > 0),
	CONSTRAINT "cars_description_check" CHECK (length(trim("cars"."description")) > 0),
	CONSTRAINT "cars_types_check" CHECK (length(trim("cars"."types")) > 0)
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"uname" varchar(100) NOT NULL,
	"koeficient" numeric(5,2) DEFAULT 100 NOT NULL,
	"from" boolean DEFAULT true NOT NULL,
	"to" boolean DEFAULT true NOT NULL,
	"in" boolean DEFAULT true NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	CONSTRAINT "countries_name_length_check" CHECK (length("countries"."name") >= 2),
	CONSTRAINT "countries_name_not_empty_check" CHECK (length(trim("countries"."name")) >= 1),
	CONSTRAINT "countries_uname_length_check" CHECK (length("countries"."uname") >= 2),
	CONSTRAINT "countries_uname_not_empty_check" CHECK (length(trim("countries"."uname")) >= 1),
	CONSTRAINT "countries_koeficient_positive_check" CHECK ("countries"."koeficient" >= 1),
	CONSTRAINT "countries_koeficient_reasonable_check" CHECK ("countries"."koeficient" <= 10000),
	CONSTRAINT "countries_route_logic_check" CHECK ("countries"."status" = false OR ("countries"."from" = true OR "countries"."to" = true OR "countries"."in" = true))
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY NOT NULL,
	"place" varchar(256) NOT NULL,
	"place_id" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"label" varchar(256) NOT NULL,
	"slug" text NOT NULL,
	"country_id" uuid NOT NULL,
	"type" varchar(160) NOT NULL,
	"lat" numeric(10, 6) NOT NULL,
	"lng" numeric(11, 6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "places_place_id_unique" UNIQUE("place_id"),
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "search_cars" (
	"quote_id" uuid NOT NULL,
	"car_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"koeficient" numeric(5,2) DEFAULT 1 NOT NULL,
	CONSTRAINT "search_cars_quote_id_car_id_pk" PRIMARY KEY("quote_id","car_id")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"machine_id" uuid NOT NULL,
	"from_place_id" text,
	"from_input" text NOT NULL,
	"to_place_id" text,
	"to_input" text NOT NULL,
	"pickup" timestamp NOT NULL,
	"dropoff" timestamp,
	"adults" smallint NOT NULL,
	"children" smallint NOT NULL,
	"infants" smallint NOT NULL,
	"source" text DEFAULT '' NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ride_details" (
	"id" uuid PRIMARY KEY NOT NULL,
	"pickup" timestamp NOT NULL,
	"dropoff" timestamp,
	"from" jsonb NOT NULL,
	"to" jsonb NOT NULL,
	"adults" smallint DEFAULT 0 NOT NULL,
	"children" smallint DEFAULT 0 NOT NULL,
	"infants" smallint DEFAULT 0 NOT NULL,
	"passenger" jsonb NOT NULL,
	"pickup_note" varchar(100) DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"distance_in_km" integer DEFAULT 0 NOT NULL,
	"duration_in_minutes" integer DEFAULT 0 NOT NULL,
	"car_id" uuid NOT NULL,
	"quote_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"from_place_id" uuid NOT NULL,
	"to_place_id" uuid NOT NULL,
	"distance" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"search_count" integer DEFAULT 0 NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "routes_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "routes_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bases" ADD CONSTRAINT "bases_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_base_id_bases_id_fk" FOREIGN KEY ("base_id") REFERENCES "public"."bases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_cars" ADD CONSTRAINT "search_cars_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_cars" ADD CONSTRAINT "search_cars_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ride_details" ADD CONSTRAINT "ride_details_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ride_details" ADD CONSTRAINT "ride_details_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_from_place_id_places_id_fk" FOREIGN KEY ("from_place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_to_place_id_places_id_fk" FOREIGN KEY ("to_place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes_faqs" ADD CONSTRAINT "routes_faqs_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bases_status_idx" ON "bases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bases_country_id_idx" ON "bases" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "bases_location_idx" ON "bases" USING btree ("lat","lng");--> statement-breakpoint
CREATE INDEX "bases_status_country_idx" ON "bases" USING btree ("status","country_id");--> statement-breakpoint
CREATE INDEX "cars_status_idx" ON "cars" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cars_pax_idx" ON "cars" USING btree ("pax");--> statement-breakpoint
CREATE INDEX "cars_luggage_idx" ON "cars" USING btree ("luggage");--> statement-breakpoint
CREATE INDEX "cars_base_id_idx" ON "cars" USING btree ("base_id");--> statement-breakpoint
CREATE INDEX "cars_status_base_id_idx" ON "cars" USING btree ("status","base_id");--> statement-breakpoint
CREATE INDEX "cars_pax_luggage_idx" ON "cars" USING btree ("pax","luggage");--> statement-breakpoint
CREATE INDEX "cars_price_km_min_price_idx" ON "cars" USING btree ("price_km","min_price");--> statement-breakpoint
CREATE INDEX "countries_name_idx" ON "countries" USING btree ("name");--> statement-breakpoint
CREATE INDEX "countries_uname_idx" ON "countries" USING btree ("uname");--> statement-breakpoint
CREATE INDEX "countries_status_idx" ON "countries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "countries_koeficient_idx" ON "countries" USING btree ("koeficient");--> statement-breakpoint
CREATE INDEX "countries_active_routes_idx" ON "countries" USING btree ("status","from","to");--> statement-breakpoint
CREATE INDEX "places_country_idx" ON "places" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "places_city_idx" ON "places" USING btree ("city");--> statement-breakpoint
CREATE INDEX "places_type_idx" ON "places" USING btree ("type");--> statement-breakpoint
CREATE INDEX "places_slug_idx" ON "places" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "places_country_city_idx" ON "places" USING btree ("country_id","city");--> statement-breakpoint
CREATE INDEX "places_country_type_idx" ON "places" USING btree ("country_id","type");--> statement-breakpoint
CREATE INDEX "places_city_type_idx" ON "places" USING btree ("city","type");--> statement-breakpoint
CREATE INDEX "places_location_idx" ON "places" USING btree ("lat","lng");--> statement-breakpoint
CREATE INDEX "places_search_idx" ON "places" USING btree ("place","city","label");--> statement-breakpoint
CREATE INDEX "places_country_location_idx" ON "places" USING btree ("country_id","lat","lng");--> statement-breakpoint
CREATE INDEX "quote_cars_quote_id_idx" ON "search_cars" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "quote_cars_car_id_idx" ON "search_cars" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX "quote_cars_price_koeficient_idx" ON "search_cars" USING btree ("price","koeficient");--> statement-breakpoint
CREATE INDEX "quotes_from_index" ON "quotes" USING btree ("from_place_id");--> statement-breakpoint
CREATE INDEX "quotes_to_index" ON "quotes" USING btree ("to_place_id");--> statement-breakpoint
CREATE INDEX "quotes_machine_id_idx" ON "quotes" USING btree ("machine_id");--> statement-breakpoint
CREATE INDEX "quotes_user_id_idx" ON "quotes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quotes_pickup_idx" ON "quotes" USING btree ("pickup");--> statement-breakpoint
CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "quotes_source_idx" ON "quotes" USING btree ("source");--> statement-breakpoint
CREATE INDEX "quotes_machine_created_idx" ON "quotes" USING btree ("machine_id","created_at");--> statement-breakpoint
CREATE INDEX "quotes_user_created_idx" ON "quotes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "quotes_route_pickup_idx" ON "quotes" USING btree ("from_place_id","to_place_id","pickup");--> statement-breakpoint
CREATE INDEX "quotes_source_created_idx" ON "quotes" USING btree ("source","created_at");--> statement-breakpoint
CREATE INDEX "quotes_pickup_route_idx" ON "quotes" USING btree ("pickup","from_place_id","to_place_id");--> statement-breakpoint
CREATE UNIQUE INDEX "from_place_id_to_place_id_idx" ON "routes" USING btree ("from_place_id","to_place_id");--> statement-breakpoint
CREATE INDEX "routes_from_place_id_idx" ON "routes" USING btree ("from_place_id");--> statement-breakpoint
CREATE INDEX "routes_to_place_id_idx" ON "routes" USING btree ("to_place_id");--> statement-breakpoint
CREATE INDEX "routes_distance_idx" ON "routes" USING btree ("distance");--> statement-breakpoint
CREATE INDEX "routes_duration_idx" ON "routes" USING btree ("duration");--> statement-breakpoint
CREATE INDEX "routes_search_count_idx" ON "routes" USING btree ("search_count");--> statement-breakpoint
CREATE INDEX "routes_url_idx" ON "routes" USING btree ("url");--> statement-breakpoint
CREATE INDEX "routes_created_at_idx" ON "routes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "routes_updated_at_idx" ON "routes" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "routes_faqs_route_id_idx" ON "routes_faqs" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "routes_faqs_question_idx" ON "routes_faqs" USING btree ("question");--> statement-breakpoint
CREATE INDEX "routes_faqs_answer_idx" ON "routes_faqs" USING btree ("answer");