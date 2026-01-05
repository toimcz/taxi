import { object, parse, pipe, string, transform } from "valibot";

const configSchema = object({
	NODE_ENV: string(),
	AUTH_COOKIE: string(),
	AUTH_SECRET: string(),
	TRUSTED_ORIGINS: pipe(
		string(),
		transform((value) => value.split(",")),
	),
});

export const config = parse(configSchema, Bun.env);
