import { relations } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgTable,
	smallint,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { primaryUUID } from "./_custom-types";
import { cars$ } from "./cars";
import { quotes$ } from "./quotes";

export const rideDetails$ = pgTable("ride_details", {
	id: primaryUUID("id"),
	pickup: timestamp("pickup", { mode: "date" }).notNull(),
	dropoff: timestamp("dropoff", { mode: "date" }),
	from: jsonb("from").notNull(),
	to: jsonb("to").notNull(),
	adults: smallint("adults").notNull().default(0),
	children: smallint("children").notNull().default(0),
	infants: smallint("infants").notNull().default(0),
	passenger: jsonb("passenger").notNull(),
	pickupNote: varchar("pickup_note", { length: 100 }).notNull().default(""),
	note: text("note").notNull().default(""),
	distanceInKm: integer("distance_in_km").default(0).notNull(),
	durationInMinutes: integer("duration_in_minutes").default(0).notNull(),
	carId: uuid("car_id")
		.notNull()
		.references(() => cars$.id),
	quoteId: uuid("quote_id")
		.notNull()
		.references(() => quotes$.id),
});

export const RIDE_DETAIL_CAR = "ride_detail_car";
export const RIDE_DETAIL_QUOTE = "ride_detail_quote";

export const rideDetailsRelations$ = relations(rideDetails$, ({ one }) => ({
	/** The car assigned for this ride */
	car: one(cars$, {
		fields: [rideDetails$.carId],
		references: [cars$.id],
		relationName: RIDE_DETAIL_CAR,
	}),
	/** The quote associated with this ride */
	quote: one(quotes$, {
		fields: [rideDetails$.quoteId],
		references: [quotes$.id],
		relationName: RIDE_DETAIL_QUOTE,
	}),
}));

export type RideDetailsSelect = typeof rideDetails$.$inferSelect;
export type RideDetailsInsert = typeof rideDetails$.$inferInsert;
export type RideDetailsUpdate = Partial<RideDetailsInsert>;
