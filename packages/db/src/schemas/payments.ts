/**
 * @fileoverview Payments schema for taxi service payment processing and transaction management
 *
 * This schema manages payment transactions for the taxi service platform, handling
 * payment processing, billing, invoicing, and financial record-keeping for bookings and rides.
 * Supports multiple payment methods, payment status tracking, and comprehensive audit trails.
 *
 * Features:
 * - Payment transaction processing with status tracking
 * - Integration with multiple payment providers (Stripe, local)
 * - Invoice generation and management
 * - Billing details and VAT rate handling
 * - Payment intent and client secret management for secure processing
 * - Comprehensive audit trail with created/updated/cancelled tracking
 * - Relationships with bookings, rides, and payment methods
 * - Optimized indexes for payment queries and reporting
 *
 * @example
 * ```typescript
 * // Create a new payment
 * const newPayment: PaymentInsert = {
 *   amount: 2500, // 25.00 CZK in cents
 *   currency: 'czk',
 *   description: 'Taxi ride payment',
 *   paymentMethodId: 'payment-method-uuid',
 *   bookingId: 'booking-uuid',
 *   status: PaymentStatus.CREATED,
 *   dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
 * };
 *
 * // Query payments by status
 * const pendingPayments = await db.select()
 *   .from(payments$)
 *   .where(eq(payments$.status, PaymentStatus.PENDING));
 * ```
 */

import { type BillingDetail, PaymentStatus } from "@taxi/contracts";
import { relations } from "drizzle-orm";
import {
	char,
	index,
	integer,
	json,
	pgEnum,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { amount, primaryUUID } from "./_custom-types";
import { users$ } from "./auth";
import { paymentMethods$ } from "./payment-methods";

const paymentStatusValues = Object.values(PaymentStatus) as unknown as readonly [
	string,
	...string[],
];

/**
 * PostgreSQL enum for payment transaction status.
 * Defines the lifecycle states of payment transactions in the system.
 */
export const paymentStatusEnum = pgEnum("payment_status", paymentStatusValues);

/**
 * Payments table schema for taxi service payment processing and transaction management.
 * Stores payment transactions with comprehensive tracking, billing details, and audit trails.
 *
 * @description Each payment record represents:
 * - A financial transaction for taxi services (booking or ride)
 * - Payment processing status and lifecycle tracking
 * - Integration with payment providers and methods
 * - Invoice generation and billing information
 * - Comprehensive audit trail for financial compliance
 * - Relationships with bookings, rides, and payment methods
 *
 * @table payments
 * @indexes
 * - Primary key on paymentId for fast transaction lookups
 * - Unique constraint on invoiceId for invoice management
 * - Indexes on status, dates, and foreign keys for query optimization
 * - Composite indexes for common payment reporting queries
 */
export const payments$ = pgTable(
	"payments",
	{
		/** @description Internal serial ID for database operations */
		id: serial("id"),

		/** @description Unique payment transaction identifier (primary key) */
		paymentId: primaryUUID("id"),

		/** @description Unique invoice number for billing and accounting */
		invoiceId: integer("invoice_id").unique(),

		/** @description Payment amount in cents (e.g., 2500 = 25.00 CZK) */
		amount: amount("amount").notNull(),

		/** @description External reference ID from payment provider */
		referenceId: varchar("reference_id", { length: 256 }).notNull().default(""),

		/** @description Payment currency code (ISO 4217, e.g., 'czk', 'eur') */
		currency: char("currency", { length: 3 }).notNull().default("czk"),

		/** @description Human-readable payment description */
		description: varchar("description", { length: 256 }).notNull(),

		/** @description Reference to the payment method used */
		paymentMethodId: uuid("payment_method_id")
			.notNull()
			.references(() => paymentMethods$.id, { onDelete: "cascade" }),

		/** @description Payment intent ID from payment provider (e.g., Stripe) */
		paymentIntentId: varchar("payment_intent_id", { length: 256 }),

		/** @description Client secret for secure payment processing */
		clientSecret: text("client_secret"),

		/** @description VAT rate applied to this payment (in basis points, e.g., 2100 = 21%) */
		vatRate: smallint("vat_rate").notNull().default(0),

		/** @description Current status of the payment transaction */
		status: paymentStatusEnum("status")
			.$type<PaymentStatus>()
			.notNull()
			.default(PaymentStatus.CREATED),

		/** @description Timestamp when payment was successfully completed */
		paidAt: timestamp("paid_at", { mode: "date" }),

		/** @description Payment due date for invoice management */
		dueAt: timestamp("due_at", { mode: "date" }).notNull(),

		/** @description Billing details for invoice generation and compliance */
		billingDetails: json("billing_details").$type<BillingDetail>().notNull(),

		/** @description Timestamp when the payment record was created */
		createdAt: timestamp("created_at", { mode: "date" })
			.$default(() => new Date())
			.notNull(),

		/** @description Timestamp when the payment record was last updated */
		updatedAt: timestamp("updated_at", { mode: "date" })
			.$default(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),

		/** @description Timestamp when the payment was cancelled (if applicable) */
		cancelledAt: timestamp("cancelled_at", { mode: "date" }),

		/** @description User who created this payment record */
		createdById: uuid("created_by_id").references(() => users$.id, {
			onDelete: "cascade",
		}),

		/** @description User who last updated this payment record */
		updatedById: uuid("updated_by_id").references(() => users$.id, {
			onDelete: "cascade",
		}),

		/** @description User who cancelled this payment (if applicable) */
		cancelledById: uuid("cancelled_by_id").references(() => users$.id, {
			onDelete: "cascade",
		}),
	},
	(table) => [
		// Performance optimization indexes
		index("payments_payment_method_idx").on(table.paymentMethodId),
		index("payments_invoice_id_idx").on(table.invoiceId),
		index("payments_reference_id_idx").on(table.referenceId),
		index("payments_status_idx").on(table.status),
		index("payments_created_at_idx").on(table.createdAt),
		index("payments_due_at_idx").on(table.dueAt),
		index("payments_paid_at_idx").on(table.paidAt),
		index("payments_cancelled_at_idx").on(table.cancelledAt),
		index("payments_created_by_idx").on(table.createdById),
		index("payments_updated_by_idx").on(table.updatedById),
		index("payments_cancelled_by_idx").on(table.cancelledById),

		// Composite indexes for common query patterns
		index("payments_status_created_at_idx").on(table.status, table.createdAt),
		index("payments_status_due_at_idx").on(table.status, table.dueAt),
		index("payments_payment_method_status_idx").on(table.paymentMethodId, table.status),
		index("payments_currency_status_idx").on(table.currency, table.status),
		index("payments_created_by_status_idx").on(table.createdById, table.status),
	],
);

/** Relation name constant for payment to ride relationship */
export const PAYMENT_RIDE = "payment_ride";
/** Relation name constant for payment to payment method relationship */
export const PAYMENT_PAYMENT_METHOD = "payment_payment_method";
/** Relation name constant for payment to billing details relationship */
export const PAYMENT_BILLING_DETAILS = "payment_billing_details";
/** Relation name constant for payment to booking relationship */
export const PAYMENT_BOOKING = "payment_booking";
/** Relation name constant for payment to creator user relationship */
export const PAYMENT_CREATED_BY = "payment_created_by";
/** Relation name constant for payment to updater user relationship */
export const PAYMENT_UPDATED_BY = "payment_updated_by";
/** Relation name constant for payment to canceller user relationship */
export const PAYMENT_CANCELLED_BY = "payment_cancelled_by";

/**
 * Defines relationships for the payments table.
 *
 * @description Establishes the following relationships:
 * - Optional one-to-one with booking (payment for booking)
 * - Optional one-to-one with ride (payment for completed ride)
 * - Required one-to-one with payment method (how payment is processed)
 * - Optional one-to-one with users for audit trail (created/updated/cancelled by)
 * - Enables complex queries across the payment ecosystem
 *
 * @example
 * ```typescript
 * // Query payment with all related data
 * const paymentWithRelations = await db.query.payments$.findFirst({
 *   where: eq(payments$.paymentId, paymentId),
 *   with: {
 *     booking: true,
 *     ride: true,
 *     paymentMethod: true,
 *     createdBy: true
 *   }
 * });
 * ```
 */
export const paymentsRelations = relations(payments$, ({ one }) => ({
	/** The payment method used for this payment */
	paymentMethod: one(paymentMethods$, {
		fields: [payments$.paymentMethodId],
		references: [paymentMethods$.id],
		relationName: PAYMENT_PAYMENT_METHOD,
	}),
	/** The user who created this payment record */
	createdBy: one(users$, {
		fields: [payments$.createdById],
		references: [users$.id],
		relationName: PAYMENT_CREATED_BY,
	}),
	/** The user who last updated this payment record */
	updatedBy: one(users$, {
		fields: [payments$.updatedById],
		references: [users$.id],
		relationName: PAYMENT_UPDATED_BY,
	}),
	/** The user who cancelled this payment (if applicable) */
	cancelledBy: one(users$, {
		fields: [payments$.cancelledById],
		references: [users$.id],
		relationName: PAYMENT_CANCELLED_BY,
	}),
}));

/**
 * Type definitions for payments schema.
 * Provides type safety for database operations and API responses.
 *
 * @example
 * ```typescript
 * // Create a new payment
 * const newPayment: PaymentInsert = {
 *   amount: 2500,
 *   currency: 'czk',
 *   description: 'Taxi ride payment',
 *   paymentMethodId: 'method-uuid',
 *   bookingId: 'booking-uuid',
 *   dueAt: new Date()
 * };
 *
 * // Query payments with status filtering
 * const payments: PaymentSelect[] = await db
 *   .select()
 *   .from(payments$)
 *   .where(eq(payments$.status, PaymentStatus.COMPLETED));
 * ```
 */

/** Complete payment record from database */
export type PaymentSelect = typeof payments$.$inferSelect;

/** Payment data for database insertion */
export type PaymentInsert = typeof payments$.$inferInsert;

/** Payment data for database updates (excludes paymentId and auto-generated fields) */
export type PaymentUpdate = Partial<Omit<PaymentInsert, "paymentId" | "id">>;
