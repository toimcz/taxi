import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { amount, koeficient } from "./_custom-types";
import { cars$ } from "./cars";
import { quotes$ } from "./quotes";

export const quoteCars$ = pgTable(
	"search_cars",
	{
		/** Reference to the search this car is assigned to */
		quoteId: uuid("quote_id")
			.notNull()
			.references(() => quotes$.id, { onDelete: "cascade" }),
		/** Reference to the car assigned to this search */
		carId: uuid("car_id")
			.notNull()
			.references(() => cars$.id, { onDelete: "cascade" }),
		/** Final price for this car in the booking (stored in cents) */
		price: amount("price").notNull(),
		/** Pricing coefficient applied to this car (default 1.0 = no adjustment) */
		koeficient: koeficient("koeficient").default(1.0).notNull(),
	},
	(t) => [
		primaryKey({ columns: [t.quoteId, t.carId] }),
		index("quote_cars_quote_id_idx").on(t.quoteId),
		index("quote_cars_car_id_idx").on(t.carId),
		index("quote_cars_price_koeficient_idx").on(t.price, t.koeficient),
	],
);

/** Relation name constant for quote-car to quote relationship */
export const QC_QUOTE = "qc_quote";
/** Relation name constant for quote-car to car relationship */
export const QC_CAR = "qc_car";

/**
 * Defines relationships for the quote-cars junction table.
 *
 * @description Establishes the following relationships:
 * - Each quote-car record belongs to one quote (many-to-one)
 * - Each quote-car record belongs to one car (many-to-one)
 * - Enables querying cars through quotes and vice versa
 */
export const quoteCarsRelations$ = relations(quoteCars$, ({ one }) => ({
	/** The quote this car assignment belongs to */
	quote: one(quotes$, {
		fields: [quoteCars$.quoteId],
		references: [quotes$.id],
		relationName: QC_QUOTE,
	}),
	/** The car assigned in this quote */
	car: one(cars$, {
		fields: [quoteCars$.carId],
		references: [cars$.id],
		relationName: QC_CAR,
	}),
}));

/**
 * Type definition for a complete quote-car record from the database.
 * Includes all fields with their transformed types.
 */
export type QuoteCarSelect = typeof quoteCars$.$inferSelect;

/**
 * Type definition for creating a new quote-car record.
 * Excludes auto-generated fields and makes optional fields nullable.
 */
export type QuoteCarInsert = typeof quoteCars$.$inferInsert;
