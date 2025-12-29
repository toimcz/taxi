import { object, parse, string } from "valibot";

const configSchema = object({
	NODE_ENV: string(),
	AUTH_COOKIE: string(),
	SCALAR_API_TOKEN: string(),
});

export const config = parse(configSchema, Bun.env);
