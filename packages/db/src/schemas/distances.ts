/**
 * Database schema for distances between places.
 * Stores calculated distances and durations between geographic locations
 * to avoid redundant API calls to Google Routes API.
 *
 * @fileoverview Contains the distances table schema for caching route calculations
 * between places, enabling efficient reuse of distance/duration data.
 */

import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, unique } from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";
import { places$ } from "./places";

/**
 * Distances table schema.
 * Stores pre-calculated distances and durations between places.
 *
 * @description Each record represents:
 * - A route between two places (from -> to)
 * - Distance in kilometers
 * - Duration in seconds
 * - Automatic caching to reduce Google Routes API calls
 * - Unique constraint on (fromPlaceId, toPlaceId) to prevent duplicates
 */
export const distances$ = pgTable(
	"distances",
	{
		/** Unique identifier for the distance record */
		id: primaryUUID("id"),
		/** Starting place ID (Google Places API place ID) */
		fromPlaceId: text("from_place_id").notNull(),
		/** Destination place ID (Google Places API place ID) */
		toPlaceId: text("to_place_id").notNull(),
		/** Distance in kilometers (rounded to nearest km) */
		distance: integer("distance").notNull(),
		/** Duration in seconds */
		duration: integer("duration").notNull(),
		...defaultColumns,
	},
	(table) => [
		// Unique constraint: one distance record per route pair
		unique("distances_route_unique").on(table.fromPlaceId, table.toPlaceId),

		// Performance indexes
		// Single column indexes
		index("distances_from_place_id_idx").on(table.fromPlaceId),
		index("distances_to_place_id_idx").on(table.toPlaceId),
		index("distances_created_at_idx").on(table.createdAt),

		// Composite indexes for common query patterns
		index("distances_route_idx").on(table.fromPlaceId, table.toPlaceId),
		index("distances_reverse_route_idx").on(table.toPlaceId, table.fromPlaceId),
	],
);

/**
 * Defines relationships for the distances table.
 */
export const distancesRelations$ = relations(distances$, ({ one }) => ({
	/** The starting place */
	fromPlace: one(places$, {
		fields: [distances$.fromPlaceId],
		references: [places$.placeId],
	}),
	/** The destination place */
	toPlace: one(places$, {
		fields: [distances$.toPlaceId],
		references: [places$.placeId],
	}),
}));

// Core type definitions
export type DistanceSelect = typeof distances$.$inferSelect;
export type DistanceInsert = typeof distances$.$inferInsert;
export type DistanceUpdate = Partial<Omit<DistanceInsert, "id" | "createdAt">>;
