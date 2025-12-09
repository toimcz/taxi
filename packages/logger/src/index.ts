import { config } from "dotenv";
import pino from "pino";

config({
	path: "../../apps/server/.env",
});

const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || nodeEnv === "") {
	throw new Error("NODE_ENV is not set");
}
export const logger = pino({
	level: nodeEnv === "development" ? "debug" : "error",
	// Production optimizations
	...(nodeEnv === "production" && {
		// Disable pretty printing in production for better performance
		formatters: {
			level: (label) => ({ level: label }),
		},
		// Reduce overhead by disabling some features
		timestamp: pino.stdTimeFunctions.isoTime,
		// Only include essential fields
		base: {
			env: nodeEnv,
		},
	}),
	// Development optimizations
	...(nodeEnv === "development" && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "HH:MM:ss",
				ignore: "pid,hostname",
			},
		},
	}),
});
