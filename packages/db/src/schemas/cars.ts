/**
 * Database schema for taxi fleet cars.
 * Defines the cars table with vehicle specifications, pricing information,
 * operational status, and relationships to bases, bookings, and rides.
 *
 * @fileoverview Contains the cars table schema, relations, and type definitions
 * for managing the taxi fleet including vehicle details, pricing, and availability.
 */

import { relations, sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	pgTable,
	smallint,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { amount, defaultColumns, primaryUUID } from "./_custom-types";
import { bases$ } from "./bases";
import { QC_CAR, quoteCars$ } from "./quote-cars";
import { RIDE_DETAIL_CAR, rideDetails$ } from "./ride-details";

/** Relation name constant for car to base relationship */
export const CAR_BASE = "car_base";

/**
 * Cars table schema.
 * Stores taxi fleet vehicles with specifications, pricing, and operational data.
 *
 * @description Each car record represents:
 * - A vehicle in the taxi fleet with detailed specifications
 * - Pricing information (per km, minimum, base prices)
 * - Operational settings (status, deposit, surge pricing)
 * - Passenger and luggage capacity
 * - Association with a specific base location
 * - Categorization through types and tags
 */
export const cars$ = pgTable(
	"cars",
	{
		/** Unique identifier for the car (UUID) */
		id: primaryUUID("id"),
		/** Display name of the car for customers (max 100 chars) */
		name: varchar("name", { length: 100 }).notNull(),
		/** Administrative name for internal use (max 100 chars) */
		adminName: varchar("admin_name", { length: 100 }).notNull(),
		/** Detailed description of the car (max 200 chars to match validation) */
		description: varchar("description", { length: 200 }).notNull(),
		/** URL or path to the car's photo */
		photo: text("photo").notNull(),
		/** Price per kilometer in cents (stored as integer) */
		priceKm: amount("price_km").notNull(),
		/** Minimum price for a ride in cents (stored as integer) */
		minPrice: amount("min_price").notNull(),
		/** Base price for starting a ride in cents (stored as integer) */
		basePrice: amount("base_price").notNull(),
		/** Whether pricing is calculated per person (default: false) */
		perPerson: boolean("per_person").default(false).notNull(),
		/** Maximum number of passengers (1-100) */
		pax: smallint("pax").notNull(),
		/** Maximum number of luggage pieces (1-100) */
		luggage: smallint("luggage").notNull(),
		/** Car type/category description (max 256 chars) */
		types: varchar("types", { length: 256 }).notNull(),
		/** Whether a deposit is required for this car (default: false) */
		deposit: boolean("deposit").default(false).notNull(),
		/** Whether surge pricing applies to this car (default: false) */
		surge: boolean("surge").default(false).notNull(),
		/** Whether the car is active and available (default: true) */
		status: boolean("status").default(true).notNull(),
		/** Array of tags for categorization (max 100 chars each) */
		tags: varchar("tags", { length: 100 })
			.array()
			.default(sql`'{}'::varchar[]`),
		/** Reference to the base where this car operates */
		baseId: uuid("base_id")
			.notNull()
			.references(() => bases$.id, { onDelete: "cascade" }),
		...defaultColumns,
	},
	(cars) => [
		// Individual indexes for common filters
		/** Index for filtering active/inactive cars */
		index("cars_status_idx").on(cars.status),
		/** Index for filtering by passenger capacity */
		index("cars_pax_idx").on(cars.pax),
		/** Index for filtering by luggage capacity */
		index("cars_luggage_idx").on(cars.luggage),
		/** Index for filtering cars by base location */
		index("cars_base_id_idx").on(cars.baseId),

		// Composite indexes for common query patterns
		/** Composite index for active cars by base (most common query) */
		index("cars_status_base_id_idx").on(cars.status, cars.baseId),
		/** Composite index for capacity-based searches */
		index("cars_pax_luggage_idx").on(cars.pax, cars.luggage),
		/** Composite index for pricing queries */
		index("cars_price_km_min_price_idx").on(cars.priceKm, cars.minPrice),

		// Check constraints for business rules
		/** Ensure passenger capacity is within valid range */
		check("cars_pax_check", sql`${cars.pax} >= 1 AND ${cars.pax} <= 100`),
		/** Ensure luggage capacity is within valid range */
		check(
			"cars_luggage_check",
			sql`${cars.luggage} >= 0 AND ${cars.luggage} <= 100`,
		),
		/** Ensure price per km is non-negative */
		check("cars_price_km_check", sql`${cars.priceKm} >= 0`),
		/** Ensure minimum price is non-negative */
		check("cars_min_price_check", sql`${cars.minPrice} >= 0`),
		/** Ensure base price is non-negative */
		check("cars_base_price_check", sql`${cars.basePrice} >= 0`),
		/** Ensure name is not empty */
		check("cars_name_check", sql`length(trim(${cars.name})) > 0`),
		/** Ensure admin name is not empty */
		check("cars_admin_name_check", sql`length(trim(${cars.adminName})) > 0`),
		/** Ensure description is not empty */
		check("cars_description_check", sql`length(trim(${cars.description})) > 0`),
		/** Ensure types is not empty */
		check("cars_types_check", sql`length(trim(${cars.types})) > 0`),
	],
);

/**
 * Defines relationships for the cars table.
 *
 * @description Establishes the following relationships:
 * - One-to-one with base (each car belongs to one base)
 * - One-to-many with rides (each car can have multiple rides)
 * - One-to-many with booking-cars junction table (many-to-many with bookings)
 * - Enables querying related data across the fleet management system
 */
export const carsRelations = relations(cars$, ({ one, many }) => ({
	/** The base location where this car operates */
	base: one(bases$, {
		fields: [cars$.baseId],
		references: [bases$.id],
		relationName: CAR_BASE,
	}),
	/** All rides performed by this car */
	rideDetails: many(rideDetails$, {
		relationName: RIDE_DETAIL_CAR,
	}),
	/** All quotes associated with this car through the junction table */
	quotes: many(quoteCars$, {
		relationName: QC_CAR,
	}),
}));

/**
 * Type definition for a complete car record from the database.
 * Includes all fields with their transformed types.
 *
 * @description Use this type when:
 * - Reading car data from the database
 * - Displaying car information in the UI
 * - Processing existing car records
 */
export type CarSelect = typeof cars$.$inferSelect;

/**
 * Type definition for creating a new car record.
 * Excludes auto-generated fields and makes optional fields nullable.
 *
 * @description Use this type when:
 * - Creating new car records
 * - Validating car input data
 * - Processing car creation requests
 */
export type CarInsert = typeof cars$.$inferInsert;
