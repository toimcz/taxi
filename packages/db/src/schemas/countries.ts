/**
 * @fileoverview Countries Database Schema
 *
 * This module defines the database schema for countries in the taxi application.
 * Countries represent geographical regions with specific routing and pricing configurations.
 *
 * Features:
 * - Country management with routing permissions (from, to, in)
 * - Pricing coefficient system for location-based pricing
 * - Status management for enabling/disabling countries
 * - Comprehensive data validation and constraints
 * - Optimized indexes for common query patterns
 * - Relations to bases for geographical organization
 *
 * @example
 * ```typescript
 * // Query active countries that allow rides from them
 * const activeFromCountries = await db.select()
 *   .from(countries$)
 *   .where(and(eq(countries$.status, true), eq(countries$.from, true)));
 *
 * // Create a new country
 * const newCountry = await db.insert(countries$).values({
 *   name: 'Czech Republic',
 *   koeficient: 120,
 *   from: true,
 *   to: true,
 *   in: true,
 *   status: true
 * });
 * ```
 */

import { relations, sql } from "drizzle-orm";
import { boolean, check, index, pgTable, varchar } from "drizzle-orm/pg-core";
import { koeficient, primaryUUID } from "./_custom-types";
import { BASE_COUNTRY, bases$ } from "./bases";

/**
 * Countries table schema for managing geographical regions and routing permissions.
 *
 * This table stores country information with routing permissions and pricing coefficients
 * for the taxi application. Each country can be configured to allow rides from, to, or within
 * its borders, with custom pricing multipliers.
 *
 * @example
 * ```typescript
 * // Insert a new country
 * await db.insert(countries$).values({
 *   name: 'Germany',
 *   koeficient: 150,
 *   from: true,
 *   to: true,
 *   in: false,
 *   status: true
 * });
 * ```
 */
export const countries$ = pgTable(
	"countries",
	{
		/** Unique identifier for the country (UUID, auto-generated) */
		id: primaryUUID("id"),

		/** Country name (2-100 characters, must be unique and non-empty) */
		name: varchar("name", { length: 100 }).notNull(),

		/** Country unaccented name (2-100 characters, must be unique and non-empty) */
		uname: varchar("uname", { length: 100 }).notNull(),

		/** Pricing coefficient for rides (1-10000, default: 100, represents percentage multiplier) */
		koeficient: koeficient("koeficient").notNull().default(100),

		/** Whether rides can originate FROM this country (default: true) */
		from: boolean("from").default(true).notNull(),

		/** Whether rides can be destined TO this country (default: true) */
		to: boolean("to").default(true).notNull(),

		/** Whether rides can occur entirely within (IN) this country (default: true) */
		in: boolean("in").default(true).notNull(),

		/** Whether this country is active and available for operations (default: true) */
		status: boolean("status").default(true).notNull(),
	},
	(countries) => [
		// Indexes for performance optimization
		index("countries_name_idx").on(countries.name),
		index("countries_uname_idx").on(countries.uname),
		index("countries_status_idx").on(countries.status),
		index("countries_koeficient_idx").on(countries.koeficient),
		index("countries_active_routes_idx").on(
			countries.status,
			countries.from,
			countries.to,
		),

		// Data validation constraints
		check("countries_name_length_check", sql`length(${countries.name}) >= 2`),
		check(
			"countries_name_not_empty_check",
			sql`length(trim(${countries.name})) >= 1`,
		),
		check("countries_uname_length_check", sql`length(${countries.uname}) >= 2`),
		check(
			"countries_uname_not_empty_check",
			sql`length(trim(${countries.uname})) >= 1`,
		),
		check(
			"countries_koeficient_positive_check",
			sql`${countries.koeficient} >= 1`,
		),
		check(
			"countries_koeficient_reasonable_check",
			sql`${countries.koeficient} <= 10000`,
		),
		check(
			"countries_route_logic_check",
			sql`${countries.status} = false OR (${countries.from} = true OR ${countries.to} = true OR ${countries.in} = true)`,
		),
	],
);

/**
 * Countries table relations definition.
 *
 * Defines the relationships between countries and other entities in the database.
 * Countries can have multiple bases (operational locations) within their borders.
 *
 * @example
 * ```typescript
 * // Query country with its bases
 * const countryWithBases = await db.query.countries$.findFirst({
 *   where: eq(countries$.id, countryId),
 *   with: {
 *     bases: true
 *   }
 * });
 * ```
 */
export const countriesRelations = relations(countries$, ({ many }) => ({
	/** All bases (operational locations) within this country */
	bases: many(bases$, {
		relationName: BASE_COUNTRY,
	}),
}));

/**
 * Type for selecting countries from the database.
 *
 * Represents the complete country object as stored in the database,
 * including all fields with their actual types and constraints.
 *
 * @example
 * ```typescript
 * const country: CountrySelect = await db.select()
 *   .from(countries$)
 *   .where(eq(countries$.id, countryId))
 *   .then(rows => rows[0]);
 *
 * console.log(country.name); // string
 * console.log(country.koeficient); // number
 * console.log(country.status); // boolean
 * ```
 */
export type CountrySelect = typeof countries$.$inferSelect;

/**
 * Type for inserting new countries into the database.
 *
 * Represents the data structure required when creating new countries.
 * Optional fields have defaults, required fields must be provided.
 *
 * @example
 * ```typescript
 * const newCountry: CountryInsert = {
 *   name: 'Austria',
 *   koeficient: 110,
 *   from: true,
 *   to: true,
 *   in: false,
 *   status: true
 *   // id is auto-generated, other booleans have defaults
 * };
 *
 * await db.insert(countries$).values(newCountry);
 * ```
 */
export type CountryInsert = typeof countries$.$inferInsert;

/**
 * Type for updating existing countries in the database.
 *
 * Represents the data structure required when updating countries.
 * Fields are optional, only include those that need to be updated.
 *
 * @example
 * ```typescript
 * const updateData: CountryUpdate = {
 *   koeficient: 120,
 *   status: false
 * };
 *
 * await db.update(countries$)
 *   .set(updateData)
 *   .where(eq(countries$.id, countryId));
 * ```
 */
export type CountryUpdate = Partial<CountryInsert>;
