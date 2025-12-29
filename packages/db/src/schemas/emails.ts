/**
 * @fileoverview Emails schema for email tracking and management
 *
 * This schema manages email records including delivery status tracking,
 * provider integration, and user associations. It supports email campaign
 * management, delivery tracking, and analytics for marketing and transactional emails.
 *
 * Features:
 * - Email delivery status tracking (created, sent, delivered, opened, clicked)
 * - Provider integration support (external email service providers)
 * - User association for email attribution
 * - Comprehensive indexing for performance
 * - Email analytics and reporting support
 *
 * @example
 * ```typescript
 * // Create a new email record
 * const newEmail: EmailInsert = {
 *   providerId: 'sendgrid-msg-123',
 *   email: 'user@example.com',
 *   subject: 'Welcome to our service',
 *   status: EmailStatus.CREATED,
 *   createdById: 'user-uuid'
 * };
 *
 * // Query emails by status
 * const deliveredEmails = await db.select()
 *   .from(emails$)
 *   .where(eq(emails$.status, EmailStatus.DELIVERED));
 * ```
 */

import { EmailStatus } from "@taxi/contracts";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";
import { users$ } from "./auth";

/**
 * Email status values extracted from the shared types package
 * Ensures consistency between frontend and backend status definitions
 */
const emailStatusValues = Object.values(EmailStatus) as unknown as readonly [string, ...string[]];

/**
 * PostgreSQL enum for email status tracking
 *
 * Available statuses:
 * - CREATED: Email record created but not yet sent
 * - SENT: Email sent to provider
 * - DELIVERED: Email delivered to recipient's inbox
 * - FIRST_OPENING: First time email was opened
 * - OPENED: Email opened (subsequent opens)
 * - CLICKED: Email link clicked
 * - INVALID_EMAIL: Email address is invalid
 */
export const emailStatusEnum = pgEnum("email_status", emailStatusValues);

/**
 * Emails table schema for email tracking and management
 *
 * This table stores email records with delivery tracking, provider integration,
 * and user associations. It supports email analytics, campaign management,
 * and delivery monitoring.
 *
 * @table emails
 * @fields
 * - id: Unique email record identifier (UUID, auto-generated)
 * - providerId: External email provider message ID (required, max 256 chars)
 * - email: Recipient email address (required, max 256 chars)
 * - subject: Email subject line (required, unlimited text)
 * - status: Email delivery status (required, enum)
 * - createdById: User who created the email (optional, foreign key)
 * - createdAt: Record creation timestamp (auto-generated)
 * - updatedAt: Record update timestamp (auto-updated)
 */
export const emails$ = pgTable(
	"emails",
	{
		id: primaryUUID("id"),
		providerId: varchar("provider_id", { length: 256 }).notNull(),
		email: varchar("email", { length: 256 }).notNull(),
		subject: text("subject").notNull(),
		status: emailStatusEnum("email_status").$type<EmailStatus>().notNull(),
		createdById: uuid("created_by_id").references(() => users$.id, {
			onDelete: "cascade",
		}),
		...defaultColumns,
	},
	(emails) => [
		// Performance indexes
		/**
		 * Index for provider-based email lookups
		 * Optimizes: SELECT * FROM emails WHERE provider_id = ?
		 */
		index("emails_provider_id_index").on(emails.providerId),

		/**
		 * Index for email address lookups
		 * Optimizes: SELECT * FROM emails WHERE email = ?
		 */
		index("emails_email_index").on(emails.email),

		/**
		 * Index for status-based filtering
		 * Optimizes: SELECT * FROM emails WHERE status = ?
		 */
		index("emails_status_index").on(emails.status),

		/**
		 * Index for user-based email queries
		 * Optimizes: SELECT * FROM emails WHERE created_by_id = ?
		 */
		index("emails_created_by_id_index").on(emails.createdById),

		/**
		 * Index for time-based queries and sorting
		 * Optimizes: SELECT * FROM emails ORDER BY created_at DESC
		 */
		index("emails_created_at_index").on(emails.createdAt),

		/**
		 * Composite index for email analytics by status and time
		 * Optimizes: SELECT * FROM emails WHERE status = ? AND created_at >= ?
		 */
		index("emails_status_created_at_index").on(emails.status, emails.createdAt),

		/**
		 * Composite index for user email history
		 * Optimizes: SELECT * FROM emails WHERE created_by_id = ? ORDER BY created_at DESC
		 */
		index("emails_user_created_at_index").on(emails.createdById, emails.createdAt),

		/**
		 * Composite index for email tracking by recipient and status
		 * Optimizes: SELECT * FROM emails WHERE email = ? AND status = ?
		 */
		index("emails_email_status_index").on(emails.email, emails.status),
	],
);

export const EMAIL_USER = "email_user";

/**
 * Email table relationships definition
 *
 * Defines the foreign key relationships between emails and other tables.
 * This enables type-safe joins and nested queries with Drizzle ORM.
 *
 * @relationships
 * - createdBy: Many-to-one relationship with users table
 *
 * @example
 * ```typescript
 * // Query emails with user information
 * const emailsWithUsers = await db
 *   .select()
 *   .from(emails$)
 *   .leftJoin(users$, eq(emails$.createdById, users$.id));
 *
 * // Using relations for nested queries
 * const emailsWithCreator = await db.query.emails$.findMany({
 *   with: {
 *     createdBy: true
 *   }
 * });
 * ```
 */
export const emailsRelations = relations(emails$, ({ one }) => ({
	createdBy: one(users$, {
		fields: [emails$.createdById],
		references: [users$.id],
		relationName: EMAIL_USER,
	}),
}));

/**
 * Type for selecting email records from the database
 *
 * Represents the complete email record as stored in the database,
 * including all fields with their actual types after database processing.
 *
 * @example
 * ```typescript
 * const email: EmailSelect = await db
 *   .select()
 *   .from(emails$)
 *   .where(eq(emails$.id, emailId))
 *   .then(rows => rows[0]);
 * ```
 */
export type EmailSelect = typeof emails$.$inferSelect;

/**
 * Type for inserting new email records into the database
 *
 * Represents the data structure required when creating new email records.
 * Optional fields (like id, createdAt, updatedAt) are automatically handled.
 *
 * @example
 * ```typescript
 * const newEmail: EmailInsert = {
 *   providerId: 'msg_123456',
 *   email: 'user@example.com',
 *   subject: 'Welcome to our service',
 *   status: EmailStatus.CREATED,
 *   createdById: userId
 * };
 *
 * await db.insert(emails$).values(newEmail);
 * ```
 */
export type EmailInsert = typeof emails$.$inferInsert;

/**
 * Type for updating existing email records
 *
 * Represents the data structure for partial updates to email records.
 * All fields are optional except those with database constraints.
 *
 * @example
 * ```typescript
 * const emailUpdate: EmailUpdate = {
 *   status: EmailStatus.DELIVERED,
 *   updatedAt: new Date()
 * };
 *
 * await db
 *   .update(emails$)
 *   .set(emailUpdate)
 *   .where(eq(emails$.id, emailId));
 * ```
 */
export type EmailUpdate = Partial<Omit<EmailInsert, "id" | "providerId" | "createdAt">>;
