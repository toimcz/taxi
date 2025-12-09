import { cache } from "@taxi/cache";
import type { BillingDetail, Role } from "@taxi/contracts/common";
import { db } from "@taxi/db";
import { users } from "@taxi/db/schemas/index";
import { type BetterAuthOptions, betterAuth, logger } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, customSession } from "better-auth/plugins";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { authOptions } from "./auth-options";

config({
	path: "../../apps/server/.env",
});

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const TRUSTED_ORIGINS = process.env.TRUSTED_ORIGINS;
if (!TRUSTED_ORIGINS) {
	throw new Error("TRUSTED_ORIGINS is not set");
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
	throw new Error("GOOGLE_CLIENT_ID is not set");
}

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) {
	throw new Error("GOOGLE_CLIENT_SECRET is not set");
}

const secondaryStorage = {
	get: async (key) => {
		const session = await cache.get(key);
		return session;
	},
	set: async (key, data, ttl) => {
		if (ttl) {
			await cache.set(key, data, "EX", ttl);
		} else {
			await cache.set(key, data);
		}
	},
	delete: async (key) => {
		await cache.del(key);
	},
} satisfies BetterAuthOptions["secondaryStorage"];

export const auth = betterAuth<BetterAuthOptions>({
	...authOptions,
	basePath: "/api/auth",
	trustedOrigins: TRUSTED_ORIGINS.split(","),
	database: drizzleAdapter(db, { provider: "pg" }),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, token, url }) => {
			logger.info(
				`Password reset requested for user: ${user.email} | Token: ${token} | URL: ${url}`,
			);
			// TODO: Implement email sending for password reset
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			mapProfileToUser: (profile) => ({
				firstName: profile.given_name,
				lastName: profile.family_name,
			}),
		},
	},
	secondaryStorage,
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			const userId = ctx.context.newSession?.session?.userId;
			if (userId) {
				try {
					console.log("Updating user last login at", userId);
					await db
						.update(users)
						.set({
							lastLoginAt: new Date(),
						})
						.where(eq(users.id, userId));
				} catch (error) {
					console.error("Error updating user last login at", error);
				}
			}
		}),
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					logger.info(`Creating new user with email: ${user.email}`);
					const data = {
						...user,
						billingDetails: {
							name: user.name,
							company: "",
							street: "",
							city: "",
							zip: "",
							country: "",
							ic: "",
							dic: "",
						} satisfies BillingDetail,
					};
					return {
						data,
					};
				},
			},
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			const typedUser = user as typeof user & { role: Role };
			return {
				user: {
					...user,
					role: typedUser.role, // Include role in session
				},
				session,
			};
		}),
		//sveltekitCookies(getRequestEvent),
	],
});

export type Session = typeof auth.$Infer.Session;
