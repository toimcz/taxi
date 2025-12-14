import { type BillingDetail, IdentityType, Role } from "@taxi/contracts/common";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { defaultColumns, primaryUUID } from "./_custom-types";

export const roles = pgEnum(
	"roles",
	Object.values(Role) as [string, ...string[]],
);
export const identityTypes = pgEnum(
	"identity_types",
	Object.values(IdentityType) as [string, ...string[]],
);

export const users$ = pgTable(
	"users",
	{
		id: primaryUUID("id"),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		emailVerified: boolean("email_verified").default(false).notNull(),
		image: text("image"),
		phone: text("phone"),
		roles: roles("roles")
			.array()
			.$type<Role[]>()
			.default([Role.USER])
			.notNull(),
		note: text("note").default("").notNull(),
		billingDetails: jsonb("billing_details").$type<BillingDetail>().notNull(),
		...defaultColumns,
		lastLoginAt: timestamp("last_login_at"),
	},
	(table) => [
		index("users_email_idx").on(table.email),
		index("users_email_verified_idx").on(table.emailVerified),
		index("users_roles_idx").on(table.roles),
		index("users_last_login_at_idx").on(table.lastLoginAt),
	],
);

export const usersRelations$ = relations(users$, ({ many }) => ({
	identities: many(identities$, {
		relationName: IDENTITY_USER,
	}),
	sessions: many(sessions$, {
		relationName: SESSION_USER,
	}),
	magicLinks: many(magicLinks$, {
		relationName: MAGIC_LINK_USER,
	}),
}));

export type UserInsert = typeof users$.$inferInsert;
export type UserSelect = typeof users$.$inferSelect;

export const identities$ = pgTable(
	"identities",
	{
		id: primaryUUID("id"),
		userId: uuid("user_id")
			.references(() => users$.id, { onDelete: "cascade" })
			.notNull(),
		provider: text("provider").notNull(),
		providerId: text("provider_id").notNull().default(""),
		passwordHash: text("password_hash"),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		...defaultColumns,
	},
	(table) => [
		index("identities_user_id_idx").on(table.userId),
		index("identities_provider_idx").on(table.provider),
		index("identities_provider_id_idx").on(table.providerId),
	],
);

export type IdentityInsert = typeof identities$.$inferInsert;
export type IdentitySelect = typeof identities$.$inferSelect;

const IDENTITY_USER = "identity_user";

export const identitiesRelations$ = relations(identities$, ({ one }) => ({
	user: one(users$, {
		fields: [identities$.userId],
		references: [users$.id],
		relationName: IDENTITY_USER,
	}),
}));

export const sessions$ = pgTable(
	"sessions",
	{
		id: primaryUUID("id"),
		userId: uuid("user_id")
			.references(() => users$.id, { onDelete: "cascade" })
			.notNull(),
		sessionId: text("session_id").notNull().unique(),
		...defaultColumns,
		expiresAt: timestamp("expires_at").notNull(),
	},
	(table) => [
		index("sessions_user_id_idx").on(table.userId),
		index("sessions_session_id_idx").on(table.sessionId),
		index("sessions_expires_at_idx").on(table.expiresAt),
	],
);

const SESSION_USER = "session_user";

export const sessionsRelations$ = relations(sessions$, ({ one }) => ({
	user: one(users$, {
		fields: [sessions$.userId],
		references: [users$.id],
		relationName: SESSION_USER,
	}),
}));

export type SessionInsert = typeof sessions$.$inferInsert;
export type SessionSelect = typeof sessions$.$inferSelect;

export const magicLinks$ = pgTable(
	"magic_links",
	{
		id: primaryUUID("id"),
		token: text("token").notNull().unique(),
		userId: uuid("user_id")
			.references(() => users$.id, { onDelete: "cascade" })
			.notNull(),
		used: boolean("used").default(false).notNull(),
		returnTo: text("return_to").notNull().default("/"),
		...defaultColumns,
		expiresAt: timestamp("expires_at").notNull(),
	},
	(table) => [
		index("magic_links_user_id_idx").on(table.userId),
		index("magic_links_token_idx").on(table.token),
		index("magic_links_expires_at_idx").on(table.expiresAt),
	],
);

export type MagicLinkInsert = typeof magicLinks$.$inferInsert;
export type MagicLinkSelect = typeof magicLinks$.$inferSelect;

const MAGIC_LINK_USER = "magic_link_user";

export const magicLinksRelations$ = relations(magicLinks$, ({ one }) => ({
	user: one(users$, {
		fields: [magicLinks$.userId],
		references: [users$.id],
		relationName: MAGIC_LINK_USER,
	}),
}));
