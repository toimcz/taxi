/**
 * Database schema for places and locations.
 * Defines the structure for geographic places including cities, addresses,
 * points of interest, and other location-based entities with Google Places integration.
 *
 * @fileoverview Contains the places table schema, relations, and type definitions
 * for managing location data with geographic coordinates, country associations,
 * and Google Places API integration for taxi booking services.
 *
 * @features
 * - Geographic location storage with precise coordinates
 * - Google Places API integration with place IDs
 * - Country-based location organization
 * - Support for various location types (cities, addresses, POIs)
 * - Optimized indexing for location-based queries
 * - Audit trail with creation and update timestamps
 *
 * @example
 * ```typescript
 * // Create a new place
 * const newPlace = await db.insert(places$).values({
 *   place: "Prague Castle",
 *   placeId: "ChIJi3lwCZyUC0cRVQCTvQz8CQQ",
 *   city: "Prague",
 *   label: "Prague Castle, Prague, Czech Republic",
 *   countryId: "country-uuid",
 *   type: "tourist_attraction",
 *   lat: 50.0909,
 *   lng: 14.4009
 * });
 *
 * // Query places with country information
 * const placesWithCountry = await db.query.places$.findMany({
 *   with: { country: true }
 * });
 * ```
 */

import { relations } from "drizzle-orm";
import { index, numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { countries$, quotes$ } from ".";
import { defaultColumns, primaryUUID } from "./_custom-types";

/**
 * Places table schema.
 * Stores geographic location data with Google Places integration,
 * coordinates, and country associations for taxi booking services.
 *
 * @description Each place represents:
 * - A geographic location with precise coordinates
 * - Integration with Google Places API via place ID
 * - Association with a specific country
 * - Support for various location types (cities, addresses, POIs)
 * - Searchable labels for user-friendly display
 * - Audit trail with creation and update timestamps
 */
export const places$ = pgTable(
	"places",
	{
		/** Unique identifier for the place */
		id: primaryUUID("id"),
		/** Place name (e.g., "Prague Castle", "Main Street 123") */
		place: varchar("place", { length: 256 }).notNull(),
		/** Google Places API place ID for external integration */
		placeId: text("place_id").unique().notNull(),
		/** City where this place is located */
		city: varchar("city", { length: 100 }).notNull(),
		/** Full display label for UI (e.g., "Prague Castle, Prague, Czech Republic") */
		label: varchar("label", { length: 256 }).notNull(),
		// Slug for URL-friendly representation (e.g., "prague-castle-prague-czech-republic")
		slug: text("slug").unique().notNull(),
		/** Reference to the country where this place is located */
		countryId: uuid("country_id")
			.notNull()
			.references(() => countries$.id, {
				onDelete: "cascade",
			}),
		/** Type of place (e.g., "city", "airport", "hotel", "tourist_attraction") */
		type: varchar("type", { length: 160 }).notNull(),
		/** Latitude coordinate (decimal degrees, -90 to 90) */
		lat: numeric("lat", { precision: 10, scale: 6, mode: "number" }).notNull(),
		/** Longitude coordinate (decimal degrees, -180 to 180) */
		lng: numeric("lng", { precision: 11, scale: 6, mode: "number" }).notNull(),
		...defaultColumns,
	},
	(table) => [
		// Performance indexes
		// Single column indexes
		index("places_country_idx").on(table.countryId),
		index("places_city_idx").on(table.city),
		index("places_type_idx").on(table.type),
		index("places_slug_idx").on(table.slug),
		index("places_created_at_idx").on(table.createdAt),
		index("places_updated_at_idx").on(table.updatedAt),

		// Composite indexes for common query patterns
		index("places_country_city_idx").on(table.countryId, table.city),
		index("places_country_type_idx").on(table.countryId, table.type),
		index("places_city_type_idx").on(table.city, table.type),
		index("places_location_idx").on(table.lat, table.lng),
		index("places_search_idx").on(table.place, table.city, table.label),
		index("places_country_location_idx").on(table.countryId, table.lat, table.lng),
	],
);

/** Relation name constant for place-country relationship */
export const PLACE_COUNTRY = "place_country";
/** Relation name constant for place as booking origin */
export const PLACE_BOOKING_FROM = "place_booking_from";
/** Relation name constant for place as booking destination */
export const PLACE_BOOKING_TO = "place_booking_to";
/** Relation name constant for place as search origin */
export const PLACE_SEARCH_FROM = "place_search_from";
/** Relation name constant for place as search destination */
export const PLACE_SEARCH_TO = "place_search_to";

/**
 * Defines relationships for the places table.
 *
 * @description Establishes the following relationships:
 * - One-to-one: place belongs to one country
 * - One-to-many: place can be origin/destination for multiple bookings
 * - One-to-many: place can be origin/destination for multiple searches
 * - Enables complex queries across the location and booking ecosystem
 *
 * @example
 * ```typescript
 * // Query place with all related data
 * const placeWithRelations = await db.query.places$.findFirst({
 *   where: eq(places$.placeId, googlePlaceId),
 *   with: {
 *     country: true,
 *     fromBookings: { limit: 10 },
 *     toBookings: { limit: 10 }
 *   }
 * });
 * ```
 */
export const placesRelations = relations(places$, ({ one, many }) => ({
	/** The country this place belongs to */
	country: one(countries$, {
		fields: [places$.countryId],
		references: [countries$.id],
		relationName: PLACE_COUNTRY,
	}),
	/** Quotes that originate from this place */
	fromSearches: many(quotes$, { relationName: PLACE_SEARCH_FROM }),
	/** Quotes that have this place as destination */
	toSearches: many(quotes$, { relationName: PLACE_SEARCH_TO }),
}));

// Core type definitions
export type PlaceSelect = typeof places$.$inferSelect;
export type PlaceInsert = typeof places$.$inferInsert;
export type PlaceUpdate = Partial<Omit<PlaceInsert, "id" | "createdAt">>;
