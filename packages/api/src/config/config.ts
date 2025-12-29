import { config as dotenvConfig } from "dotenv";
import { email, object, optional, parse, picklist, pipe, string, transform } from "valibot";

dotenvConfig({ path: "../../apps/server/.env" });

const configSchema = object({
	NODE_ENV: pipe(
		optional(string(), "development"),
		transform((val) => val || "development"),
		picklist(["development", "staging", "production", "test"] as const),
	),
	APP_NAME: string(),
	APP_EMAIL: pipe(string(), email()),
	APP_PHONE: string(),
	DATABASE_URL: string(),
	AUTH_SECRET: string(),
	AUTH_URL: string(),
	AUTH_COOKIE: string(),
	TRUSTED_ORIGINS: pipe(
		string(),
		transform((val) => val.split(",")),
	),
	MEILISEARCH_HOST: string(),
	MEILISEARCH_KEY: string(),
	REDIS_HOST: string(),
	REDIS_PORT: pipe(string(), transform(Number)),
	REDIS_PASSWORD: optional(string(), ""),
	GOOGLE_API_KEY: string(),
	TOMTOM_API_KEY: string(),
	GOOGLE_CLIENT_ID: string(),
	GOOGLE_CLIENT_SECRET: string(),
	GOOGLE_CALLBACK_URL: string(),
	GOOGLE_SCOPE: string(),
	GOSMS_SMS: pipe(
		string(),
		transform((val) => val === "true"),
	),
	GOSMS_CLIENT_ID: string(),
	GOSMS_CLIENT_SECRET: string(),
	GOSMS_CHANNEL: string(),
	BREVO_API_KEY: string(),
	SLACK_WEBHOOK: string(),
	DO_ENDPOINT: string(),
	DO_KEY: string(),
	DO_SECRET: string(),
	DO_BUCKET: string(),
	DO_URL: string(),
	OPENAI_API_KEY: string(),
	OPENROUTER_API_KEY: string(),
	OPENROUTER_MODEL: string(),
	PAYMENT_START_ID: pipe(string(), transform(Number)),
});

const validated = parse(configSchema, process.env);

export const config = validated;
