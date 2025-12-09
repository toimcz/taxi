import { logger } from "@taxi/logger";
import { config } from "dotenv";
import { Redis } from "ioredis";

config({
	path: "../../apps/server/.env",
});

const redisHost = process.env.REDIS_HOST;
if (!redisHost || redisHost === "") {
	throw new Error("REDIS_HOST is not set");
}
const redisPort = process.env.REDIS_PORT;
if (!redisPort || redisPort === "") {
	throw new Error("REDIS_PORT is not set");
}
const redisPassword = process.env.REDIS_PASSWORD;

export const cache = new Redis({
	host: redisHost,
	port: Number(redisPort),
	password: redisPassword || undefined,
	maxRetriesPerRequest: 3,
	enableReadyCheck: true,
	enableOfflineQueue: true, // Allow queuing commands while connecting
	lazyConnect: false, // Auto-connect immediately
	retryStrategy: (times) => {
		// Retry connection with exponential backoff
		const delay = Math.min(times * 50, 2000);
		logger.warn(`Redis retry attempt ${times}, waiting ${delay}ms`);
		return delay;
	},
	reconnectOnError: (err) => {
		// Reconnect on specific errors
		const targetError = "READONLY";
		if (err.message.includes(targetError)) {
			logger.warn("Redis reconnecting due to READONLY error");
			return true;
		}
		return false;
	},
});

cache.on("connect", () => {
	logger.info("Redis connected successfully");
});

cache.on("ready", () => {
	logger.info("Redis is ready to accept commands");
});

cache.on("error", (err) => {
	logger.error(`Redis connection error: ${err.message}`);
	// Don't exit immediately, let retry strategy handle it
});

cache.on("close", () => {
	logger.warn("Redis connection closed");
});

cache.on("reconnecting", () => {
	logger.info("Redis reconnecting...");
});

export const checkCacheHealth = async () => {
	try {
		// Wait for Redis to be ready before pinging
		if (cache.status !== "ready") {
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error("Redis connection timeout"));
				}, 5000);

				cache.once("ready", () => {
					clearTimeout(timeout);
					resolve();
				});

				cache.once("error", (err) => {
					clearTimeout(timeout);
					reject(err);
				});
			});
		}

		await cache.ping();
		logger.info("Redis is healthy and reachable");
	} catch (err) {
		const error = err instanceof Error ? err : new Error(String(err));
		logger.error(`Redis health check failed: ${error.message}`);
		process.exit(1);
	}
};

export const closeCacheConnection = async () => {
	try {
		await cache.quit();
		logger.info("Redis connection closed successfully");
	} catch (err) {
		const error = err instanceof Error ? err : new Error(String(err));
		logger.error(`Error closing Redis connection: ${error.message}`);
		throw error;
	}
};
