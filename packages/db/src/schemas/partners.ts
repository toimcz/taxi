/**
 * @fileoverview Partners schema for taxi service management
 *
 * This schema manages partner organizations that operate taxi fleets and drivers.
 * Partners represent business entities that provide taxi services through the platform,
 * managing their own fleets of vehicles and drivers under the main service umbrella.
 *
 * Features:
 * - Partner organization information (name, contact details)
 * - Status tracking (active/inactive partners)
 * - Contact management (email, phone)
 * - Driver and fleet relationship management
 * - Automatic timestamp tracking
 * - Optimized indexes for partner operations
 *
 * @example
 * ```typescript
 * // Create a new partner
 * const newPartner: PartnerInsert = {
 *   name: 'Prague Taxi Services',
 *   email: 'contact@praguetaxi.cz',
 *   phone: '+420123456789',
 *   status: true
 * };
 *
 * // Query active partners with their fleets
 * const activePartners = await db.select()
 *   .from(partners$)
 *   .where(eq(partners$.status, true));
 * ```
 */

import { relations } from "drizzle-orm";
import { boolean, index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { DRIVER_PARTNER, drivers$, FLEET_PARTNER, fleets$ } from ".";

/**
 * Partners table schema for taxi service management.
 * Stores partner organization information including contact details, status,
 * and relationships with drivers and fleets.
 *
 * @description Each partner represents:
 * - A business entity providing taxi services
 * - Organization with contact information and operational status
 * - Manager of drivers and fleet vehicles
 * - Active participant in the taxi service platform
 *
 * @table partners
 * @indexes
 * - Primary key on id for fast lookups
 * - Index on name for partner searches
 * - Index on email for contact lookups
 * - Index on status for active partner filtering
 * - Composite index on (status, name) for active partner queries
 */
export const partners$ = pgTable(
	"partners",
	{
		/** @description Unique identifier for the partner organization */
		id: uuid("id").primaryKey().defaultRandom(),

		/** @description Partner organization name (required, max 100 chars) */
		name: varchar("name", { length: 100 }).notNull(),

		/** @description Partner contact email address (optional, max 256 chars) */
		email: varchar("email", { length: 256 }),

		/** @description Partner contact phone number (optional, max 50 chars) */
		phone: varchar("phone", { length: 50 }),

		/** @description Partner operational status (active/inactive, default true) */
		status: boolean("status").default(true).notNull(),

		/** @description Timestamp when the partner was created */
		createdAt: timestamp("created_at", { mode: "date" })
			.$default(() => new Date())
			.notNull(),

		/** @description Timestamp when the partner was last updated */
		updatedAt: timestamp("updated_at", { mode: "date" })
			.$default(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		// Performance optimization indexes
		index("partners_name_idx").on(table.name),
		index("partners_email_idx").on(table.email),
		index("partners_status_idx").on(table.status),
		index("partners_created_at_idx").on(table.createdAt),

		// Composite indexes for common query patterns
		index("partners_status_name_idx").on(table.status, table.name),
		index("partners_status_created_at_idx").on(table.status, table.createdAt),
	],
);

export const partnersRelations = relations(partners$, ({ many }) => ({
	drivers: many(drivers$, { relationName: DRIVER_PARTNER }),
	fleets: many(fleets$, { relationName: FLEET_PARTNER }),
}));

/**
 * @fileoverview Type definitions for partners schema operations
 *
 * These types provide comprehensive type safety for database operations,
 * API validation, and frontend components when working with partner data.
 *
 * @example
 * ```typescript
 * // Database operations
 * const partner: PartnerSelect = await db.select().from(partners$).where(eq(partners$.id, partnerId));
 * const newPartner: PartnerInsert = { name: 'New Partner', email: 'contact@partner.com' };
 * const updates: PartnerUpdate = { status: false, updatedAt: new Date() };
 *
 * // API validation
 * const createPartnerSchema = object(pick(PartnerInsert, ['name', 'email', 'phone']));
 * const updatePartnerSchema = object(partial(pick(PartnerUpdate, ['name', 'email', 'phone', 'status'])));
 * ```
 */

/** Complete partner record as stored in database */
export type PartnerSelect = typeof partners$.$inferSelect;

/** Data required to create a new partner */
export type PartnerInsert = typeof partners$.$inferInsert;

/** Data that can be updated for existing partner */
export type PartnerUpdate = Partial<Omit<PartnerInsert, "id" | "createdAt">>;

/** Partner data with related entities (drivers and fleets) */
export type PartnerWithRelations = PartnerSelect & {
	drivers?: Array<{
		id: string;
		firstName: string;
		lastName: string;
		status: boolean;
	}>;
	fleets?: Array<{ id: string; name: string; status: boolean }>;
};

/** Partner summary for list views and dropdowns */
export type PartnerSummary = Pick<PartnerSelect, "id" | "name" | "status">;

/** Partner contact information */
export type PartnerContact = Pick<PartnerSelect, "id" | "name" | "email" | "phone">;
