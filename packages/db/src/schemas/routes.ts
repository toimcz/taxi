import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";
import { places$ } from "./places";

export const routes$ = pgTable(
	"routes",
	{
		id: primaryUUID("id"),
		title: varchar("title", { length: 256 }).notNull(),
		description: varchar("description", { length: 256 }).notNull(),
		content: text("content").notNull(),
		fromPlaceId: uuid("from_place_id")
			.notNull()
			.references(() => places$.id),
		toPlaceId: uuid("to_place_id")
			.notNull()
			.references(() => places$.id),
		distance: integer("distance").notNull().default(0),
		duration: integer("duration").notNull().default(0),
		searchCount: integer("search_count").notNull().default(0),
		url: text("url").notNull().unique(),
		status: boolean("status").notNull().default(true),
		/** Timestamp when the destination record was created */
		...defaultColumns,
	},
	(routes) => [
		uniqueIndex("from_place_id_to_place_id_idx").on(routes.fromPlaceId, routes.toPlaceId),
		index("routes_from_place_id_idx").on(routes.fromPlaceId),
		index("routes_to_place_id_idx").on(routes.toPlaceId),
		index("routes_distance_idx").on(routes.distance),
		index("routes_duration_idx").on(routes.duration),
		index("routes_search_count_idx").on(routes.searchCount),
		index("routes_url_idx").on(routes.url),
		index("routes_created_at_idx").on(routes.createdAt),
		index("routes_updated_at_idx").on(routes.updatedAt),
	],
);

export const routesFaqs$ = pgTable(
	"routes_faqs",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		routeId: uuid("route_id")
			.notNull()
			.references(() => routes$.id, { onDelete: "cascade" }),
		question: text("question").notNull(),
		answer: text("answer").notNull(),
	},
	(routesFaqs) => [
		index("routes_faqs_route_id_idx").on(routesFaqs.routeId),
		index("routes_faqs_question_idx").on(routesFaqs.question),
		index("routes_faqs_answer_idx").on(routesFaqs.answer),
	],
);

const ROUTES_FAQS = "routes_faqs";

export const routesRelations$ = relations(routes$, ({ one, many }) => ({
	fromPlace: one(places$, {
		fields: [routes$.fromPlaceId],
		references: [places$.id],
	}),
	toPlace: one(places$, {
		fields: [routes$.toPlaceId],
		references: [places$.id],
	}),
	faqs: many(routesFaqs$, {
		relationName: ROUTES_FAQS,
	}),
}));

export const routesFaqsRelations$ = relations(routesFaqs$, ({ one }) => ({
	route: one(routes$, {
		fields: [routesFaqs$.routeId],
		references: [routes$.id],
		relationName: ROUTES_FAQS,
	}),
}));

export type RouteSelect = typeof routes$.$inferSelect;
export type RouteInsert = typeof routes$.$inferInsert;
export type RouteUpdate = Partial<RouteInsert>;
export type RouteFaqSelect = typeof routesFaqs$.$inferSelect;
export type RouteFaqInsert = typeof routesFaqs$.$inferInsert;
export type RouteFaqUpdate = Omit<RouteFaqInsert, "id" | "routeId">;
