/**
 * @fileoverview Payment methods schema for taxi service payment processing
 *
 * This schema manages available payment methods for the taxi service platform,
 * supporting multiple payment providers (Stripe, local) and configurable visibility.
 * Payment methods define how customers can pay for their taxi rides and bookings.
 *
 * Features:
 * - Multiple payment provider support (Stripe, local payments)
 * - Public/private payment method visibility control
 * - Admin and customer-facing naming conventions
 * - Detailed descriptions for payment method selection
 * - Optimized indexes for payment processing queries
 * - Comprehensive validation for payment method data
 *
 * @example
 * ```typescript
 * // Create a new payment method
 * const newPaymentMethod: PaymentMethodInsert = {
 *   name: 'Credit Card',
 *   adminName: 'Stripe Credit Card Processing',
 *   description: 'Pay securely with your credit or debit card',
 *   provider: PaymentMethodProvider.STRIPE,
 *   public: true
 * };
 *
 * // Query public payment methods
 * const publicMethods = await db.select()
 *   .from(paymentMethods$)
 *   .where(eq(paymentMethods$.public, true));
 * ```
 */

import { PaymentMethodProvider } from "@taxi/contracts";
import { relations } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { PAYMENT_PAYMENT_METHOD, payments$ } from "./payments";

const PaymentMethodProviderValues = Object.values(PaymentMethodProvider) as unknown as readonly [
	string,
	...string[],
];

/**
 * PostgreSQL enum for payment method providers.
 * Defines the available payment processing providers for the platform.
 */
export const paymentMethodProviderEnum = pgEnum(
	"payment_method_provider",
	PaymentMethodProviderValues,
);

/**
 * Payment methods table schema for taxi service payment processing.
 * Stores available payment methods with provider information, visibility settings,
 * and descriptive content for customer and admin interfaces.
 *
 * @description Each payment method represents:
 * - A specific way customers can pay for taxi services
 * - Integration with payment providers (Stripe, local processing)
 * - Configurable visibility for public customer access
 * - Dual naming system for customer and admin interfaces
 * - Detailed descriptions for payment method selection
 *
 * @table payment_methods
 * @indexes
 * - Primary key on id for fast lookups
 * - Index on public for filtering visible payment methods
 * - Index on provider for provider-specific queries
 * - Index on name for payment method searches
 * - Composite index on (public, provider) for common filtering
 */
export const paymentMethods$ = pgTable(
	"payment_methods",
	{
		/** @description Unique identifier for the payment method */
		id: uuid("id").primaryKey().defaultRandom(),

		/** @description Customer-facing payment method name (max 100 chars) */
		name: varchar("name", { length: 100 }).notNull(),

		/** @description Admin-facing payment method name for management (max 100 chars) */
		adminName: varchar("admin_name", { length: 100 }).notNull(),

		/** @description Detailed description of the payment method (max 160 chars) */
		description: varchar("description", { length: 160 }).notNull(),

		/** @description Payment processing provider (Stripe, local, etc.) */
		provider: paymentMethodProviderEnum("provider").notNull(),

		/** @description Whether this payment method is visible to customers */
		public: boolean("public").default(true).notNull(),

		/** @description Whether this payment method is active and available for use */
		status: boolean("status").default(true).notNull(),

		/** @description Timestamp when the payment method was created */
		createdAt: timestamp("created_at", { mode: "date" })
			.$default(() => new Date())
			.notNull(),

		/** @description Timestamp when the payment method was last updated */
		updatedAt: timestamp("updated_at", { mode: "date" })
			.$default(() => new Date())
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		// Performance optimization indexes
		index("payment_methods_public_idx").on(table.public),
		index("payment_methods_provider_idx").on(table.provider),
		index("payment_methods_name_idx").on(table.name),
		index("payment_methods_created_at_idx").on(table.createdAt),

		// Composite indexes for common query patterns
		index("payment_methods_public_provider_idx").on(table.public, table.provider),
		index("payment_methods_public_name_idx").on(table.public, table.name),
		index("payment_methods_status_idx").on(table.status),
	],
);

export const paymentMethodsRelations = relations(paymentMethods$, ({ many }) => ({
	payments: many(payments$, {
		relationName: PAYMENT_PAYMENT_METHOD,
	}),
}));

/**
 * Type definitions for payment methods schema.
 * Provides type safety for database operations and API responses.
 *
 * @example
 * ```typescript
 * // Select all public payment methods
 * const publicMethods: PaymentMethodSelect[] = await db
 *   .select()
 *   .from(paymentMethods$)
 *   .where(eq(paymentMethods$.public, true));
 *
 * // Create new payment method
 * const newMethod: PaymentMethodInsert = {
 *   name: 'Credit Card',
 *   adminName: 'Stripe Credit Card',
 *   description: 'Pay with your credit or debit card',
 *   provider: 'stripe',
 *   public: true
 * };
 * ```
 */

/** Complete payment method record from database */
export type PaymentMethodSelect = typeof paymentMethods$.$inferSelect;

/** Payment method data for database insertion */
export type PaymentMethodInsert = typeof paymentMethods$.$inferInsert;

/** Payment method data for database updates (all fields optional) */
export type PaymentMethodUpdate = Partial<Omit<PaymentMethodInsert, "id" | "createdAt">>;
