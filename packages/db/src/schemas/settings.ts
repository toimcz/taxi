/**
 * Database schema for application configuration management.
 * Defines the configs table for storing key-value configuration pairs
 * with environment-specific values and metadata.
 *
 * @fileoverview Contains the configs table schema and type definitions
 * for managing application settings, feature flags, and environment-specific
 * configuration values with support for development overrides.
 */

import { boolean, index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { primaryUUID } from "./_custom-types";

/**
 * Settings table schema.
 * Stores application configuration key-value pairs with environment-specific
 * values and metadata for runtime configuration management.
 *
 * @description Each config entry represents:
 * - A unique configuration key with production and development values
 * - Descriptive information for administrative purposes
 * - Editability flag to control runtime modification permissions
 * - Audit timestamps for tracking configuration changes
 */
export const settings$ = pgTable(
	"settings",
	{
		/** @description Unique identifier for the configuration entry */
		id: primaryUUID("id"),

		/** @description Unique configuration key (e.g., 'max_upload_size', 'feature_flags.new_ui') */
		key: varchar("key").unique().notNull(),

		/** @description Production configuration value */
		value: varchar("value").notNull(),

		/** @description Development environment override value */
		devValue: varchar("dev_value").notNull(),

		/** @description Human-readable description of the configuration purpose */
		description: text("description").notNull(),

		/** @description Whether this configuration can be modified at runtime */
		editable: boolean("editable").default(true).notNull(),

		/** @description Timestamp when the configuration was created */
		createdAt: timestamp("created_at").defaultNow().notNull(),

		/** @description Timestamp when the configuration was last updated */
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(configs) => [
		// Indexes for query optimization
		/** @description Index for filtering by editable status */
		index("configs_editable_idx").on(configs.editable),

		/** @description Index for ordering by creation date */
		index("configs_created_at_idx").on(configs.createdAt),

		/** @description Index for ordering by update date */
		index("configs_updated_at_idx").on(configs.updatedAt),

		/** @description Composite index for editable configs ordered by key */
		index("configs_editable_key_idx").on(configs.editable, configs.key),
	],
);

/**
 * Type for reading configuration records from the database.
 * Represents the complete structure of a config entry as stored in the database.
 *
 * @description Use this type when:
 * - Fetching configuration data from the database
 * - Displaying configuration information in admin interfaces
 * - Processing configuration values in application logic
 * - Returning configuration data from API endpoints
 *
 * @example
 * ```typescript
 * const config: ConfigSelect = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   key: 'app.max_upload_size',
 *   value: '10485760',
 *   devValue: '52428800',
 *   description: 'Maximum file upload size in bytes',
 *   editable: true,
 *   createdAt: new Date('2024-01-01T00:00:00Z'),
 *   updatedAt: new Date('2024-01-01T00:00:00Z')
 * };
 * ```
 */
export type SettingSelect = typeof settings$.$inferSelect;

/**
 * Type for creating new configuration records in the database.
 * Represents the data structure required when inserting new config entries.
 *
 * @description Use this type when:
 * - Creating new configuration entries
 * - Validating configuration input data
 * - Defining configuration creation APIs
 * - Seeding initial configuration data
 *
 * @example
 * ```typescript
 * const newConfig: ConfigInsert = {
 *   key: 'feature.new_dashboard',
 *   value: 'false',
 *   devValue: 'true',
 *   description: 'Enable the new dashboard interface',
 *   editable: true
 *   // id, createdAt, updatedAt are auto-generated
 * };
 * ```
 */
export type SettingInsert = typeof settings$.$inferInsert;

/**
 * Type for updating existing configuration records in the database.
 * Represents the data structure required when updating config entries.
 *
 * @description Use this type when:
 * - Modifying existing configuration values
 * - Validating configuration update data
 * - Defining configuration update APIs
 *
 * @example
 * ```typescript
 * const updateConfig: ConfigUpdate = {
 *   value: 'true',
 *   devValue: 'false',
 *   description: 'Enable the new dashboard interface (dev mode)',
 *   editable: false
 *   // id, createdAt, updatedAt are auto-generated
 * };
 * ```
 */

export type SettingUpdate = Partial<SettingInsert>;
