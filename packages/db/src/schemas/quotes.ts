import { relations, sql } from "drizzle-orm";
import {
	index,
	pgTable,
	smallint,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";
import { users$ } from "./auth";
import { QC_CAR, quoteCars$ } from "./quote-cars";
import { RIDE_DETAIL_QUOTE, rideDetails$ } from "./ride-details";

export const quotes$ = pgTable(
	"quotes",
	{
		id: primaryUUID("id"),
		machineId: uuid("machine_id").notNull().default(sql`uuid_generate_v7()`),
		fromPlaceId: text("from_place_id"),
		fromInput: text("from_input").notNull(),
		toPlaceId: text("to_place_id"),
		toInput: text("to_input").notNull(),
		pickup: timestamp("pickup", { mode: "date" }).notNull(),
		dropoff: timestamp("dropoff", { mode: "date" }),
		adults: smallint("adults").notNull(),
		children: smallint("children").notNull(),
		infants: smallint("infants").notNull(),
		source: text("source").notNull().default(""),
		userId: uuid("user_id").references(() => users$.id, {
			onDelete: "set null",
		}),
		...defaultColumns,
	},
	(quotes) => [
		// Single column indexes
		index("quotes_from_index").on(quotes.fromPlaceId),
		index("quotes_to_index").on(quotes.toPlaceId),
		index("quotes_machine_id_idx").on(quotes.machineId),
		index("quotes_user_id_idx").on(quotes.userId),
		index("quotes_pickup_idx").on(quotes.pickup),
		index("quotes_created_at_idx").on(quotes.createdAt),
		index("quotes_source_idx").on(quotes.source),

		// Composite indexes for common query patterns
		index("quotes_machine_created_idx").on(quotes.machineId, quotes.createdAt),
		index("quotes_user_created_idx").on(quotes.userId, quotes.createdAt),
		index("quotes_route_pickup_idx").on(
			quotes.fromPlaceId,
			quotes.toPlaceId,
			quotes.pickup,
		),
		index("quotes_source_created_idx").on(quotes.source, quotes.createdAt),
		index("quotes_pickup_route_idx").on(
			quotes.pickup,
			quotes.fromPlaceId,
			quotes.toPlaceId,
		),
	],
);

export const quotesRelations$ = relations(quotes$, ({ many, one }) => ({
	cars: many(quoteCars$, {
		relationName: QC_CAR,
	}),
	rideDetails: one(rideDetails$, {
		fields: [quotes$.id],
		references: [rideDetails$.quoteId],
		relationName: RIDE_DETAIL_QUOTE,
	}),
}));

export type QuoteSelect = typeof quotes$.$inferSelect;
export type QuoteInsert = typeof quotes$.$inferInsert;
export type QuoteUpdate = Partial<QuoteInsert>;
