/**
 * @fileoverview Drivers schema for taxi service management
 *
 * This schema manages driver information including personal details, status tracking,
 * and partner relationships. It supports driver registration, status management,
 * and partner-driver associations for fleet management.
 *
 * Features:
 * - Driver personal information (name, email, phone)
 * - Status tracking (active/inactive)
 * - Partner relationship management
 * - Automatic timestamp tracking
 * - Optimized indexes for common queries
 *
 * @example
 * ```typescript
 * // Create a new driver
 * const newDriver: DriverInsert = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+420123456789',
 *   partnerId: 'partner-uuid',
 *   status: true
 * };
 *
 * // Query drivers by partner
 * const partnerDrivers = await db.select()
 *   .from(drivers$)
 *   .where(eq(drivers$.partnerId, partnerId));
 * ```
 */

import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { partners$ } from "./partners";

export const DRIVER_PARTNER = "driver_partner";

/**
 * Drivers table schema for managing taxi drivers
 *
 * This table stores driver information including personal details, status,
 * and partner associations. It supports driver management operations
 * and partner-driver relationships.
 *
 * @table drivers
 * @fields
 * - id: Unique driver identifier (UUID, auto-generated)
 * - firstName: Driver's first name (required, max 100 chars)
 * - lastName: Driver's last name (required, max 100 chars)
 * - email: Driver's email address (required, max 256 chars)
 * - phone: Driver's phone number (required, max 50 chars)
 * - partnerId: Associated partner ID (required, foreign key)
 * - status: Driver active status (default: true)
 * - createdAt: Record creation timestamp (auto-generated)
 * - updatedAt: Record update timestamp (auto-updated)
 */
export const drivers$ = pgTable(
	"drivers",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		firstName: varchar("first_name", { length: 100 }).notNull(),
		lastName: varchar("last_name", { length: 100 }).notNull(),
		email: varchar("email", { length: 256 }).notNull(),
		phone: varchar("phone", { length: 50 }).notNull(),
		status: boolean("status").default(true).notNull(),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners$.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { mode: "date" })
			.$default(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(drivers) => [
		// Performance indexes
		/**
		 * Index for efficient partner-based driver queries
		 * Optimizes: SELECT * FROM drivers WHERE partner_id = ?
		 */
		index("drivers_partner_id_idx").on(drivers.partnerId),

		/**
		 * Index for status-based filtering
		 * Optimizes: SELECT * FROM drivers WHERE status = ?
		 */
		index("drivers_status_idx").on(drivers.status),

		/**
		 * Composite index for active drivers by partner
		 * Optimizes: SELECT * FROM drivers WHERE partner_id = ? AND status = true
		 */
		index("drivers_partner_status_idx").on(drivers.partnerId, drivers.status),

		/**
		 * Index for email-based lookups
		 * Optimizes: SELECT * FROM drivers WHERE email = ?
		 */
		index("drivers_email_idx").on(drivers.email),

		/**
		 * Index for name-based searches
		 * Optimizes: SELECT * FROM drivers WHERE first_name ILIKE ? OR last_name ILIKE ?
		 */
		index("drivers_name_idx").on(drivers.firstName, drivers.lastName),

		/**
		 * Unique constraint ensuring one phone number per partner
		 * Prevents duplicate phone numbers within the same partner
		 */
		uniqueIndex("drivers_phone_partner_id_idx").on(drivers.phone, drivers.partnerId),
	],
);

/**
 * Driver relationship definitions
 *
 * Defines the relationships between drivers and other entities:
 * - partner: Many-to-one relationship with partners table
 * - rides: One-to-many relationship with rides table
 *
 * @example
 * ```typescript
 * // Query driver with partner information
 * const driverWithPartner = await db.query.drivers$.findFirst({
 *   where: eq(drivers$.id, driverId),
 *   with: {
 *     partner: true,
 *     rides: true
 *   }
 * });
 * ```
 */
export const driversRelations = relations(drivers$, ({ one }) => ({
	partner: one(partners$, {
		fields: [drivers$.partnerId],
		references: [partners$.id],
		relationName: DRIVER_PARTNER,
	}),
}));

/**
 * Driver selection type for database queries
 *
 * Represents the complete driver record as stored in the database,
 * including all fields with their actual database types.
 *
 * @example
 * ```typescript
 * const driver: DriverSelect = {
 *   id: 'uuid-string',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   phone: '+420123456789',
 *   status: true,
 *   partnerId: 'partner-uuid',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * ```
 */
export type DriverSelect = typeof drivers$.$inferSelect;

/**
 * Driver insertion type for creating new records
 *
 * Represents the data structure required when inserting a new driver.
 * Optional fields include id (auto-generated) and timestamps (auto-managed).
 *
 * @example
 * ```typescript
 * const newDriver: DriverInsert = {
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@example.com',
 *   phone: '+420987654321',
 *   partnerId: 'partner-uuid',
 *   status: true // optional, defaults to true
 * };
 *
 * await db.insert(drivers$).values(newDriver);
 * ```
 */
export type DriverInsert = typeof drivers$.$inferInsert;

/**
 * Driver update type for modifying existing records
 *
 * Represents the data structure for updating driver records.
 * All fields are optional except when business logic requires them.
 *
 * @example
 * ```typescript
 * const driverUpdate: DriverUpdate = {
 *   email: 'newemail@example.com',
 *   status: false
 * };
 *
 * await db.update(drivers$)
 *   .set(driverUpdate)
 *   .where(eq(drivers$.id, driverId));
 * ```
 */
export type DriverUpdate = Partial<DriverInsert>;
