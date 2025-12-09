/**
 * @fileoverview Services database schema definition for TaxiCzechia platform
 *
 * This module defines the database schema for managing services offered by the platform.
 * Services represent different transportation or related services that can be displayed
 * to users, managed by administrators, and integrated into the booking flow.
 *
 * Features:
 * - Service content management with rich text support
 * - Position-based ordering for display control
 * - SEO-friendly slug generation and management
 * - Image attachment support for visual representation
 * - Status-based visibility control
 * - Comprehensive audit trail with timestamps
 * - Optimized database indexes for performance
 *
 * @module database/schemas/services
 * @version 1.0.0
 * @since 2024-01-01
 */

import { boolean, index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";

/**
 * Services database table definition.
 *
 * Stores information about various services offered by the TaxiCzechia platform.
 * Services can include transportation services, additional offerings, or promotional
 * content that needs to be displayed to users in a structured manner.
 *
 * @description This table supports:
 * - Content management system functionality
 * - SEO optimization through slugs
 * - Visual content with image support
 * - Flexible ordering through position field
 * - Status-based content visibility
 * - Full audit trail with timestamps
 *
 * @example
 * ```typescript
 * // Creating a new service
 * const newService = {
 *   position: 1,
 *   image: '/images/airport-transfer.jpg',
 *   slug: 'airport-transfer',
 *   title: 'Airport Transfer Service',
 *   description: 'Reliable airport transportation',
 *   content: '<p>Detailed service description...</p>',
 *   status: true
 * };
 * ```
 */
export const services$ = pgTable(
	"services",
	{
		/** Unique identifier for the service record (UUID v7) */
		id: primaryUUID("id"),

		/** Display order position for service listing (lower numbers appear first) */
		position: integer("position").notNull(),

		/** Image URL or path for visual representation of the service */
		photo: text("image").notNull(),

		/** SEO-friendly URL slug for the service (must be unique) */
		slug: text("slug").notNull().unique(),

		/** Service title/name displayed to users */
		title: text("title").notNull(),

		/** Brief description of the service for previews and listings */
		description: text("description").notNull(),

		/** Full HTML content describing the service in detail */
		content: text("content").notNull(),

		/** Service visibility status (true = active/visible, false = inactive/hidden) */
		status: boolean("status").notNull().default(true),

		...defaultColumns,
	},
	(table) => [
		// =============================================================================
		// PERFORMANCE OPTIMIZATION INDEXES
		// =============================================================================

		/** Index for filtering by status (existing) */
		index("services_status_index").on(table.status),

		/** Index for ordering services by position (most common query) */
		index("services_position_idx").on(table.position),

		/** Index for slug-based lookups (SEO URLs) */
		index("services_slug_idx").on(table.slug),

		/** Composite index for active services ordered by position */
		index("services_active_position_idx").on(table.status, table.position),

		/** Index for content management queries (created date) */
		index("services_created_at_idx").on(table.createdAt),

		/** Index for content management queries (updated date) */
		index("services_updated_at_idx").on(table.updatedAt),

		/** Composite index for admin panel filtering and sorting */
		index("services_status_updated_idx").on(table.status, table.updatedAt),

		/** Index for title-based searches and sorting */
		index("services_title_idx").on(table.title),
	],
);

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Type definition for selecting a complete service record from the database.
 * Includes all fields with their proper TypeScript types.
 *
 * @description Use this type when:
 * - Fetching complete service records from database
 * - Working with full service data in business logic
 * - Passing complete service objects between functions
 * - Implementing service management features
 *
 * @example
 * ```typescript
 * const service: _Service = await db.select().from(services$).where(eq(services$.id, serviceId));
 * ```
 */
export type ServiceSelect = typeof services$.$inferSelect;

/**
 * Type definition for creating a new service record.
 * Excludes auto-generated fields like id, createdAt, and updatedAt.
 *
 * @description Use this type when:
 * - Creating new service records
 * - Validating service creation input
 * - Implementing service creation APIs
 * - Building service creation forms
 *
 * @example
 * ```typescript
 * const newService: _ServiceCreate = {
 *   position: 1,
 *   image: '/images/service.jpg',
 *   slug: 'new-service',
 *   title: 'New Service',
 *   description: 'Service description',
 *   content: '<p>Service content</p>',
 *   status: true
 * };
 * ```
 */
export type ServiceInsert = typeof services$.$inferInsert;

/**
 * Type definition for updating an existing service record.
 * Requires ID field and makes all other fields optional for partial updates.
 *
 * @description Use this type when:
 * - Updating existing service records
 * - Implementing service edit functionality
 * - Handling partial service updates
 * - Building service management APIs
 *
 * @example
 * ```typescript
 * const serviceUpdate: _ServiceUpdate = {
 *   id: 'service-uuid',
 *   title: 'Updated Service Title',
 *   status: false
 * };
 * ```
 */
export type ServiceUpdate = Omit<Partial<ServiceInsert>, "id"> & { id: string };
