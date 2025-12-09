import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authOptions } from "./auth-options";

// Use process.env for CLI compatibility
const DATABASE_URL =
	process.env.DATABASE_URL || "postgresql://localhost:5432/dummy";

// Create a minimal database instance for CLI (won't actually connect)
const sql = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(sql);

const options: BetterAuthOptions = {
	database: drizzleAdapter(db, { provider: "pg" }),
	secondaryStorage: {
		get: async () => "",
		set: async () => "",
		delete: async () => "",
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: "",
			clientSecret: "",
		},
	},
	...authOptions,
};

// Export auth instance for CLI (default export or named export as 'auth')
const auth = betterAuth<BetterAuthOptions>(options);

export default auth;
export { auth };
