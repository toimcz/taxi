import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { primaryUUID } from "./_custom-types";

export const error$ = pgTable("errors", {
	id: primaryUUID("id"),
	timestamp: timestamp("timestamp").defaultNow().notNull(),
	statusCode: integer("status_code").notNull(),
	code: text("code").notNull(),
	message: text("message").notNull(),
	errorType: text("error_type").notNull(),
	path: text("path").notNull(),
	method: varchar("method", { length: 10 }).notNull(),
	stack: text("stack"),
});
