/**
 * @fileoverview Pages schema for content management system
 *
 * This schema manages static and dynamic page content for the taxi service website.
 * It supports content management operations including page creation, editing,
 * and SEO-friendly URL routing through slug-based navigation.
 *
 * Features:
 * - SEO-friendly slug-based routing
 * - Unique page titles for content organization
 * - Rich text content storage
 * - Automatic timestamp tracking for content management
 * - Optimized indexes for content retrieval
 *
 * @example
 * ```typescript
 * // Create a new page
 * const newPage: PageInsert = {
 *   slug: 'about-us',
 *   title: 'About Our Taxi Service',
 *   content: '<h1>Welcome to our taxi service...</h1>'
 * };
 *
 * // Query page by slug for routing
 * const page = await db.select()
 *   .from(pages$)
 *   .where(eq(pages$.slug, 'about-us'))
 *   .limit(1);
 * ```
 */

import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";

/**
 * Pages table schema for content management system.
 * Stores website pages with SEO-friendly routing and content management capabilities.
 *
 * @description Each page represents:
 * - A unique content page with slug-based routing
 * - SEO-optimized title and content structure
 * - Rich text content for flexible page layouts
 * - Automatic timestamp tracking for content management
 *
 * @table pages
 * @indexes
 * - Primary key on id for fast lookups
 * - Unique constraint on slug for URL routing
 * - Unique constraint on title for content organization
 * - Composite index on (slug, title) for content queries
 * - Index on createdAt for chronological sorting
 */
export const pages$ = pgTable(
	"pages",
	{
		/** @description Unique identifier for the page */
		id: primaryUUID("id"),

		/** @description SEO-friendly URL slug (e.g., 'about-us', 'contact') */
		slug: varchar("slug", { length: 255 }).unique().notNull(),

		/** @description Page title for navigation and SEO */
		title: varchar("title", { length: 255 }).unique().notNull(),

		/** @description Optional meta description for SEO */
		description: varchar("description", { length: 255 }).notNull(),

		/** @description Rich text content of the page (HTML supported) */
		content: text("content").notNull(),

		/** @description Whether the page should be displayed at the top of the navigation */
		top: boolean("top").notNull().default(false),

		/** @description Whether the page should be displayed at the bottom of the navigation */
		bottom: boolean("bottom").notNull().default(false),

		/** @description Whether the page is active and visible */
		status: boolean("status").notNull().default(true),

		/** @description Position of the page in the navigation */
		position: integer("position").notNull().default(0),

		...defaultColumns,
	},
	(pages) => [
		// Performance indexes
		index("pages_slug_idx").on(pages.slug),
		index("pages_title_idx").on(pages.title),
		index("pages_created_at_idx").on(pages.createdAt),
		index("pages_slug_title_idx").on(pages.slug, pages.title),
		index("pages_content_search_idx").using(
			"gin",
			sql`to_tsvector('english', ${pages.content})`,
		),
	],
);

/**
 * Type definitions for pages schema
 *
 * @description Provides type-safe interfaces for:
 * - Database operations (select, insert, update)
 * - API endpoints and validation
 * - Frontend components and forms
 */

/** @description Type for selecting pages from database */
export type PageSelect = typeof pages$.$inferSelect;

/** @description Type for inserting new pages into database */
export type PageInsert = typeof pages$.$inferInsert;

/** @description Type for updating existing pages in database */
export type PageUpdate = Partial<Omit<PageInsert, "id" | "createdAt">>;
