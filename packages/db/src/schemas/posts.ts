/**
 * Posts Schema
 *
 * This module defines the database schema for blog posts and content in the taxi booking platform's
 * content management system. It provides comprehensive content management capabilities including
 * categorization, user attribution, publishing workflows, and SEO optimization.
 *
 * Features:
 * - Rich content management with title, description, and full content
 * - SEO-optimized slugs with category-based uniqueness
 * - Tag-based content organization and filtering
 * - Publishing workflow with scheduled publishing and expiration
 * - User attribution for content creation and updates
 * - Category-based content organization
 * - Public/private content visibility control
 * - Image attachment support
 *
 * @example
 * ```typescript
 * // Creating a new blog post
 * const post = await db.insert(posts$).values({
 *   title: 'Best Taxi Routes in Prague',
 *   description: 'Discover the most efficient taxi routes in Prague',
 *   slug: 'best-taxi-routes-prague',
 *   tags: ['travel', 'prague', 'routes'],
 *   content: '<h1>Best Taxi Routes...</h1>',
 *   image: '/images/prague-routes.jpg',
 *   categoryId: 'travel-tips-category-id',
 *   createdById: 'author-user-id',
 *   updatedById: 'author-user-id',
 *   publishAt: new Date()
 * });
 *
 * // Finding published posts by category
 * const publishedPosts = await db.query.posts$.findMany({
 *   where: and(
 *     eq(posts$.public, true),
 *     eq(posts$.categoryId, 'travel-tips-category-id'),
 *     lte(posts$.publishAt, new Date())
 *   ),
 *   with: { category: true, createdBy: true }
 * });
 * ```
 *
 * @module PostsSchema
 * @version 1.0.0
 */

import { relations } from "drizzle-orm";

import {
	boolean,
	index,
	json,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { postCategories$, users$ } from ".";
import { defaultColumns, primaryUUID } from "./_custom-types";

/**
 * Posts Table Schema
 *
 * Defines the structure for blog posts and content management in the CMS.
 * Each post belongs to a category and has comprehensive metadata for content management.
 */
export const posts$ = pgTable(
	"posts",
	{
		/** @description Unique identifier for the post */
		id: primaryUUID("id"),

		/** @description Post title (max 120 characters for SEO optimization) */
		title: varchar("title", { length: 120 }).notNull(),

		/** @description Post description/excerpt (max 256 characters for meta descriptions) */
		description: varchar("description", { length: 256 }).notNull(),

		/** @description URL-friendly slug (unique within category for SEO) */
		slug: varchar("slug", { length: 256 }).notNull(),

		/** @description Array of tags for content categorization and filtering */
		tags: json("tags").$type<string[]>().notNull().default([]),

		/** @description Full post content (HTML/Markdown) */
		content: text("content").notNull(),

		/** @description Post visibility (true = public, false = private/draft) */
		public: boolean("public").default(true).notNull(),

		/** @description Featured image URL or path */
		photo: text("photo").notNull(),

		...defaultColumns,

		/** @description Scheduled publication timestamp */
		publishAt: timestamp("publish_at", { mode: "date" }).notNull().defaultNow(),

		/** @description Optional expiration timestamp for time-sensitive content */
		expiresAt: timestamp("expires_at", { mode: "date" }),

		/** @description Reference to the post category */
		categoryId: uuid("category_id")
			.notNull()
			.references(() => postCategories$.id, { onDelete: "cascade" }),

		/** @description Reference to the user who created the post */
		createdById: uuid("created_by_id")
			.notNull()
			.references(() => users$.id, { onDelete: "cascade" }),

		/** @description Reference to the user who last updated the post */
		updatedById: uuid("updated_by_id")
			.notNull()
			.references(() => users$.id, { onDelete: "cascade" }),

		/** @description Reference to the user who deleted the post */
		deletedById: uuid("deleted_by_id").references(() => users$.id, {
			onDelete: "cascade",
		}),
	},
	(table) => [
		// Unique constraints
		unique("posts_category_slug_unique").on(table.categoryId, table.slug),

		// Performance indexes - Single column
		index("posts_slug_index").on(table.slug),
		index("posts_public_index").on(table.public),
		index("posts_created_at_index").on(table.createdAt),
		index("posts_updated_at_index").on(table.updatedAt),
		index("posts_publish_at_index").on(table.publishAt),
		index("posts_expires_at_index").on(table.expiresAt),
		index("posts_category_id_index").on(table.categoryId),
		index("posts_created_by_id_index").on(table.createdById),
		index("posts_updated_by_id_index").on(table.updatedById),
		index("posts_deleted_by_id_index").on(table.deletedById),

		// Composite indexes for common queries
		index("posts_public_publish_at_index").on(table.public, table.publishAt),
		index("posts_category_public_index").on(table.categoryId, table.public),
		index("posts_category_publish_at_index").on(table.categoryId, table.publishAt),
		index("posts_public_created_at_index").on(table.public, table.createdAt),
		index("posts_created_by_created_at_index").on(table.createdById, table.createdAt),
	],
);

export const POST_CATEGORY = "post_category";
export const POST_CREATED_BY = "post_created_by";
export const POST_UPDATED_BY = "post_updated_by";
export const POST_DELETED_BY = "post_deleted_by";
/**
 * Posts Relations
 *
 * Defines the relationships between posts and other entities in the system.
 * Each post belongs to a category and has user attribution for creation and updates.
 */
export const postsRelations = relations(posts$, ({ one }) => ({
	/** @description The category this post belongs to */
	category: one(postCategories$, {
		fields: [posts$.categoryId],
		references: [postCategories$.id],
		relationName: POST_CATEGORY,
	}),

	/** @description The user who created this post */
	createdBy: one(users$, {
		fields: [posts$.createdById],
		references: [users$.id],
		relationName: POST_CREATED_BY,
	}),

	/** @description The user who last updated this post */
	updatedBy: one(users$, {
		fields: [posts$.updatedById],
		references: [users$.id],
		relationName: POST_UPDATED_BY,
	}),

	/** @description The user who deleted this post */
	deletedBy: one(users$, {
		fields: [posts$.deletedById],
		references: [users$.id],
		relationName: POST_DELETED_BY,
	}),
}));

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Core post types inferred from the schema
 */

/** @description Complete post record as stored in database */
export type PostSelect = typeof posts$.$inferSelect;

/** @description Data required to create a new post */
export type PostInsert = typeof posts$.$inferInsert;

/** @description Data for updating an existing post */
export type PostUpdate = Omit<Partial<PostInsert>, "id">;
