/**
 * @fileoverview Fleet vehicles schema for taxi service management
 *
 * This schema manages fleet vehicle information including vehicle details, license plates,
 * operational status, and partner relationships. It supports fleet management operations,
 * vehicle tracking, and partner-fleet associations for taxi service operations.
 *
 * Features:
 * - Vehicle information (name, license plate)
 * - Operational status tracking (active/inactive)
 * - STK (technical inspection) date tracking
 * - Partner relationship management
 * - Automatic timestamp tracking
 * - Optimized indexes for common queries
 *
 * @example
 * ```typescript
 * // Create a new fleet vehicle
 * const newFleet: FleetInsert = {
 *   name: 'Škoda Octavia',
 *   plate: '1A2 3456',
 *   status: true,
 *   stk: new Date('2024-12-31'),
 *   partnerId: 'partner-uuid'
 * };
 *
 * // Query active fleets by partner
 * const activeFleets = await db.select()
 *   .from(fleets$)
 *   .where(and(eq(fleets$.partnerId, partnerId), eq(fleets$.status, true)));
 * ```
 */

import { relations, sql } from "drizzle-orm";
import { boolean, check, index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { partners$ } from ".";

/**
 * Relation name constant for fleet-partner relationship
 */
export const FLEET_PARTNER = "fleet_partner";

/**
 * Fleet vehicles table schema for managing taxi fleet
 *
 * This table stores vehicle information including specifications, license plates,
 * operational status, and partner associations. It supports fleet management
 * operations and partner-fleet relationships.
 *
 * @table fleets
 * @fields
 * - id: Unique fleet vehicle identifier (UUID, auto-generated)
 * - name: Vehicle name/model (required, max 256 chars)
 * - plate: License plate number (required, max 50 chars)
 * - status: Operational status (required, default true)
 * - stk: STK (technical inspection) expiration date (optional)
 * - partnerId: Associated partner ID (required, foreign key)
 * - createdAt: Record creation timestamp (auto-generated)
 * - updatedAt: Record update timestamp (auto-updated)
 */
export const fleets$ = pgTable(
	"fleets",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 256 }).notNull(),
		plate: varchar("plate", { length: 50 }).notNull(),
		status: boolean("status").default(true).notNull(),
		stk: timestamp("stk", { mode: "date" }),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners$.id, {
				onDelete: "cascade",
			}),
		createdAt: timestamp("created_at", { mode: "date" })
			.$default(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(fleets) => [
		// Data validation constraints
		/**
		 * Ensures vehicle name is not empty and has reasonable length
		 */
		check(
			"fleets_name_check",
			sql`length(trim(${fleets.name})) >= 1 AND length(trim(${fleets.name})) <= 256`,
		),

		/**
		 * Validates license plate format (Czech format: 1A2 3456 or similar)
		 * Allows various formats but ensures basic structure
		 */
		check(
			"fleets_plate_check",
			sql`length(trim(${fleets.plate})) >= 3 AND length(trim(${fleets.plate})) <= 50 AND ${fleets.plate} ~ '^[A-Z0-9 ]+$'`,
		),

		/**
		 * Ensures STK date is not in the past (if provided)
		 */
		check("fleets_stk_check", sql`${fleets.stk} IS NULL OR ${fleets.stk} >= current_date`),

		/**
		 * Ensures created_at is not in the future
		 */
		check("fleets_created_at_check", sql`${fleets.createdAt} <= now()`),

		/**
		 * Ensures updated_at is not before created_at
		 */
		check("fleets_updated_at_check", sql`${fleets.updatedAt} >= ${fleets.createdAt}`),

		// Performance indexes
		/**
		 * Index for partner-based fleet lookups
		 * Optimizes: SELECT * FROM fleets WHERE partner_id = ?
		 */
		index("fleets_partner_id_idx").on(fleets.partnerId),

		/**
		 * Index for status-based filtering
		 * Optimizes: SELECT * FROM fleets WHERE status = ?
		 */
		index("fleets_status_idx").on(fleets.status),

		/**
		 * Index for license plate lookups
		 * Optimizes: SELECT * FROM fleets WHERE plate = ?
		 */
		index("fleets_plate_idx").on(fleets.plate),

		/**
		 * Index for STK expiration tracking
		 * Optimizes: SELECT * FROM fleets WHERE stk <= ?
		 */
		index("fleets_stk_idx").on(fleets.stk),

		/**
		 * Composite index for partner fleet management
		 * Optimizes: SELECT * FROM fleets WHERE partner_id = ? AND status = ?
		 */
		index("fleets_partner_status_idx").on(fleets.partnerId, fleets.status),

		/**
		 * Composite index for STK monitoring by partner
		 * Optimizes: SELECT * FROM fleets WHERE partner_id = ? AND stk <= ?
		 */
		index("fleets_partner_stk_idx").on(fleets.partnerId, fleets.stk),

		/**
		 * Composite index for time-based queries
		 * Optimizes: SELECT * FROM fleets ORDER BY created_at DESC
		 */
		index("fleets_created_at_idx").on(fleets.createdAt),
	],
);

/**
 * Fleet table relationships definition
 *
 * Defines the foreign key relationships between fleets and other tables.
 * This enables type-safe joins and nested queries with Drizzle ORM.
 *
 * @relationships
 * - partner: Many-to-one relationship with partners table
 *
 * @example
 * ```typescript
 * // Query fleets with partner information
 * const fleetsWithPartners = await db
 *   .select()
 *   .from(fleets$)
 *   .leftJoin(partners$, eq(fleets$.partnerId, partners$.id));
 *
 * // Using relations for nested queries
 * const fleetsWithPartner = await db.query.fleets$.findMany({
 *   with: {
 *     partner: true
 *   }
 * });
 * ```
 */
export const fleetsRelations = relations(fleets$, ({ one }) => ({
	partner: one(partners$, {
		fields: [fleets$.partnerId],
		references: [partners$.id],
		relationName: FLEET_PARTNER,
	}),
}));

/**
 * Type for selecting fleet records from the database
 *
 * Represents the complete fleet record as stored in the database,
 * including all fields with their actual types after database processing.
 *
 * @example
 * ```typescript
 * const fleet: FleetSelect = await db
 *   .select()
 *   .from(fleets$)
 *   .where(eq(fleets$.id, fleetId))
 *   .then(rows => rows[0]);
 * ```
 */
export type FleetSelect = typeof fleets$.$inferSelect;

/**
 * Type for inserting new fleet records into the database
 *
 * Represents the data structure required when creating new fleet records.
 * Optional fields (like id, createdAt, updatedAt) are automatically handled.
 *
 * @example
 * ```typescript
 * const newFleet: FleetInsert = {
 *   name: 'Škoda Octavia',
 *   plate: '1A2 3456',
 *   status: true,
 *   stk: new Date('2024-12-31'),
 *   partnerId: partnerId
 * };
 *
 * await db.insert(fleets$).values(newFleet);
 * ```
 */
export type FleetInsert = typeof fleets$.$inferInsert;

/**
 * Type for updating existing fleet records
 *
 * Represents the data structure for partial updates to fleet records.
 * All fields are optional except those with database constraints.
 *
 * @example
 * ```typescript
 * const fleetUpdate: FleetUpdate = {
 *   status: false,
 *   stk: new Date('2025-01-31'),
 *   updatedAt: new Date()
 * };
 *
 * await db
 *   .update(fleets$)
 *   .set(fleetUpdate)
 *   .where(eq(fleets$.id, fleetId));
 * ```
 */
export type FleetUpdate = Partial<Omit<FleetInsert, "id" | "createdAt">>;
