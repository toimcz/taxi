/**
 * Database schema for taxi bases (operational locations).
 * Defines the structure for taxi base locations, their geographic coordinates,
 * operational parameters, and relationships with countries and cars.
 *
 * @fileoverview Contains the bases table schema, relations, and type definitions
 * for managing taxi operational bases across different cities and countries.
 */

import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	numeric,
	pgTable,
	smallint,
	text,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { defaultColumns, koeficient, primaryUUID } from "./_custom-types";
import { CAR_BASE, cars$ } from "./cars";
import { countries$ } from "./countries";

/**
 * Taxi bases table schema.
 * Stores information about taxi operational bases including location,
 * pricing coefficients, and operational status.
 *
 * @description Each base represents a taxi operational location with:
 * - Geographic coordinates (lat/lng)
 * - Pricing coefficient for fare calculations
 * - Operational strength and status
 * - Association with a specific country and city
 * - Optional Google Places integration
 */
export const bases$ = pgTable(
	"bases",
	{
		/** Unique identifier for the base */
		id: primaryUUID("id"),
		/** City name where the base is located */
		city: varchar("city", { length: 256 }).notNull(),
		/** Reference to the country where this base operates */
		countryId: uuid("country_id")
			.notNull()
			.references(() => countries$.id, {
				onDelete: "cascade",
			}),
		/** Google Places ID for location integration */
		placeId: text("place_id"),
		/** Pricing coefficient for fare calculations (default 1.0 = no adjustment) */
		koeficient: koeficient("koeficient").notNull().default(1.0),
		/** Operational strength/capacity of the base */
		strength: smallint("strength").notNull().default(0),
		/** Whether the base is currently active */
		status: boolean("status").notNull().default(true),
		/** Latitude coordinate (WGS84) - must be between -90 and 90 */
		lat: numeric("lat", { precision: 10, scale: 6, mode: "number" }).notNull(),
		/** Longitude coordinate (WGS84) - must be between -180 and 180 */
		lng: numeric("lng", { precision: 11, scale: 6, mode: "number" }).notNull(),
		...defaultColumns,
	},
	(bases) => [
		index("bases_status_idx").on(bases.status),
		index("bases_country_id_idx").on(bases.countryId),
		index("bases_location_idx").on(bases.lat, bases.lng),
		index("bases_status_country_idx").on(bases.status, bases.countryId),
		unique("bases_city_country_id_unique").on(bases.city, bases.countryId),
	],
);

export const BASE_COUNTRY = "base_country";

/**
 * Defines relationships between bases and other entities.
 *
 * @description Establishes the following relationships:
 * - Each base belongs to one country (many-to-one)
 * - Each base can have many cars assigned to it (one-to-many)
 */
export const basesRelations = relations(bases$, ({ one, many }) => ({
	/** The country where this base is located */
	country: one(countries$, {
		fields: [bases$.countryId],
		references: [countries$.id],
		relationName: BASE_COUNTRY,
	}),
	/** Cars assigned to this base */
	cars: many(cars$, {
		relationName: CAR_BASE,
	}),
}));

/**
 * Type definition for a complete base record from the database.
 * Includes all fields with their transformed types.
 */
export type BaseSelect = typeof bases$.$inferSelect;

/**
 * Type definition for creating a new base record.
 * Excludes auto-generated fields and makes optional fields nullable.
 */
export type BaseInsert = typeof bases$.$inferInsert;
