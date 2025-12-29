/**
 * Post Categories Schema
 *
 * This module defines the database schema for post categories in the taxi booking platform's
 * content management system. It provides hierarchical categorization for blog posts, news,
 * and other content types.
 *
 * Features:
 * - Unique slug-based URLs for SEO optimization
 * - Status management for content visibility
 * - Timestamp tracking for audit trails
 * - One-to-many relationship with posts
 *
 * @example
 * ```typescript
 * // Creating a new post category
 * const category = await db.insert(postCategories).values({
 *   name: 'Travel Tips',
 *   slug: 'travel-tips',
 *   status: true
 * });
 *
 * // Finding posts by category
 * const categoryWithPosts = await db.query.postCategories.findFirst({
 *   where: eq(postCategories.slug, 'travel-tips'),
 *   with: { posts: true }
 * });
 * ```
 *
 * @module PostCategoriesSchema
 * @version 1.0.0
 */

import { relations } from "drizzle-orm";
import { boolean, index, pgTable, varchar } from "drizzle-orm/pg-core";
import { POST_CATEGORY, posts$ } from ".";
import { defaultColumns, primaryUUID } from "./_custom-types";

/**
 * Post Categories Table Schema
 *
 * Defines the structure for categorizing blog posts and content in the CMS.
 * Each category has a unique slug for SEO-friendly URLs and status management.
 */
export const postCategories$ = pgTable(
	"postcategories",
	{
		/** @description Unique identifier for the post category */
		id: primaryUUID("id"),

		/** @description Human-readable category name (max 160 characters) */
		name: varchar("name", { length: 160 }).notNull(),

		/** @description URL-friendly slug for SEO optimization (max 256 characters, unique) */
		slug: varchar("slug", { length: 256 }).unique().notNull(),

		/** @description Optional category description (max 256 characters) */
		description: varchar("description", { length: 256 })
			.notNull()
			.$default(() => ""),

		/** @description Category visibility status (true = active, false = hidden) */
		status: boolean("status").default(true).notNull(),

		...defaultColumns,
	},
	(table) => [
		// Performance indexes
		index("postcategories_slug_index").on(table.slug),
		index("postcategories_name_index").on(table.name),
		index("postcategories_status_index").on(table.status),
		index("postcategories_created_at_index").on(table.createdAt),
		index("postcategories_updated_at_index").on(table.updatedAt),

		// Composite indexes for common queries
		index("postcategories_status_created_at_index").on(table.status, table.createdAt),
		index("postcategories_status_name_index").on(table.status, table.name),
	],
);

/**
 * Post Categories Relations
 *
 * Defines the relationships between post categories and other entities in the system.
 * Each category can have multiple posts associated with it.
 */
export const postCategoriesRelations = relations(postCategories$, ({ many }) => ({
	/** @description All posts that belong to this category */
	posts: many(posts$, {
		relationName: POST_CATEGORY,
	}),
}));

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Core post category types inferred from the schema
 */

/** @description Complete post category record as stored in database */
export type PostCategorySelect = typeof postCategories$.$inferSelect;

/** @description Data required to create a new post category */
export type PostCategoryInsert = typeof postCategories$.$inferInsert;

/** @description Data for updating an existing post category */
export type PostCategoryUpdate = Omit<Partial<PostCategoryInsert>, "id">;
