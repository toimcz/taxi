import { Redis } from "ioredis";
import { config } from "../../config";
import { Logger } from "../logger";

/**
 * Shared Redis client singleton
 * All CacheService instances share the same connection to avoid multiple connections
 */
let redisInstance: Redis | null = null;
let isConnected = false;
const redisLogger = new Logger("CacheService");

/**
 * Setup Redis connection event handlers for monitoring and debugging
 * Only called once for the singleton instance
 */
function setupEventHandlers(client: Redis): void {
	client.on("connect", () => {
		redisLogger.info(`Redis connecting to ${config.REDIS_HOST}:${config.REDIS_PORT}`);
	});

	client.on("ready", () => {
		isConnected = true;
		redisLogger.info("Redis connection established");
	});

	client.on("error", (error: Error) => {
		isConnected = false;
		redisLogger.error(`Redis error: ${error.message}`);
	});

	client.on("close", () => {
		isConnected = false;
		redisLogger.warn("Redis connection closed");
	});

	client.on("reconnecting", () => {
		redisLogger.info("Redis reconnecting...");
	});

	client.on("end", () => {
		isConnected = false;
		redisLogger.info("Redis connection ended");
	});
}

/**
 * Get or create the shared Redis client instance
 */
function getRedisInstance(): Redis {
	if (!redisInstance) {
		redisInstance = new Redis({
			host: config.REDIS_HOST,
			port: config.REDIS_PORT,
			password: config.REDIS_PASSWORD || undefined,
			// No keyPrefix here - each CacheService handles its own prefix
			// Connection settings
			connectTimeout: 10000,
			maxRetriesPerRequest: 3,
			enableReadyCheck: true,
			// Retry strategy with exponential backoff
			retryStrategy: (times: number) => {
				if (times > 10) {
					redisLogger.error("Redis max retries exceeded");
					return null;
				}
				const delay = Math.min(times * 200, 2000);
				redisLogger.warn(`Redis retry attempt ${times}, delay: ${delay}ms`);
				return delay;
			},
			// Reconnect on error
			reconnectOnError: (err: Error) => {
				const targetError = "READONLY";
				if (err.message.includes(targetError)) {
					return true;
				}
				return false;
			},
		});

		setupEventHandlers(redisInstance);
	}

	return redisInstance;
}

/**
 * Check if Redis is connected
 */
function getRedisConnectionStatus(): boolean {
	return isConnected;
}

/**
 * Close Redis connection gracefully
 */
async function closeRedisConnection(): Promise<void> {
	if (redisInstance) {
		if (redisInstance.status === "end") {
			redisLogger.debug("Redis connection already closed");
			return;
		}

		try {
			await redisInstance.quit();
			redisLogger.info("Redis connection closed gracefully");
		} catch (error) {
			redisLogger.error(
				`Error closing Redis connection: ${error instanceof Error ? error.message : String(error)}`,
			);
			// Force disconnect if graceful quit fails
			redisInstance.disconnect();
		} finally {
			redisInstance = null;
			isConnected = false;
		}
	}
}

/**
 * Production-ready cache service using ioredis
 * https://github.com/redis/ioredis
 *
 * Features:
 * - Type-safe generic operations
 * - Automatic retry with exponential backoff
 * - Connection error handling
 * - Production-safe key deletion with SCAN
 * - Comprehensive error logging
 * - Graceful connection management
 * - Shared Redis connection across all instances
 */
export class CacheService {
	private readonly logger = new Logger("CacheService");
	readonly #client: Redis;
	readonly #prefix: string;

	constructor(prefix: string) {
		this.#prefix = prefix;
		// Use shared Redis client singleton
		this.#client = getRedisInstance();
	}

	/**
	 * Check if Redis is connected
	 */
	get isConnected(): boolean {
		return getRedisConnectionStatus();
	}

	/**
	 * Set a value in cache with expiration
	 * @param key - Cache key (without prefix)
	 * @param value - Value to cache (will be JSON serialized)
	 * @param expiration - TTL in seconds
	 * @throws Error if serialization or Redis operation fails
	 */
	async set<T>(key: string, value: T, expiration: number): Promise<void> {
		try {
			const serialized = JSON.stringify(value);
			const prefixedKey = `${this.#prefix}:${key}`;
			await this.#client.setex(prefixedKey, expiration, serialized);
		} catch (error) {
			this.logger.error(
				`Failed to set cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Set a value in cache with expiration
	 * @param key - Cache key (without prefix)
	 * @param tags - Cache tags
	 * @param value - Value to cache (will be JSON serialized)
	 * @param expiration - TTL in seconds
	 * @throws Error if serialization or Redis operation fails
	 */
	async setWithTags<T>(key: string, tags: string[], value: T, expiration: number): Promise<void> {
		try {
			const serialized = JSON.stringify(value);
			const prefixedKey = `${this.#prefix}:${key}`;
			const pipeline = this.#client.pipeline();
			pipeline.setex(prefixedKey, expiration, serialized);
			for (const tag of tags) {
				const tagSetKey = `${this.#prefix}:tag:${tag}`;
				pipeline.sadd(tagSetKey, prefixedKey);
				pipeline.expire(tagSetKey, expiration + 5); // Slightly longer than item expiration
			}
			await pipeline.exec();
		} catch (error) {
			this.logger.error(
				`Failed to set cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Get a value from cache
	 * @param key - Cache key (without prefix)
	 * @returns Parsed value or null if not found
	 * @throws Error if deserialization fails
	 */
	async get<T>(key: string): Promise<T | null> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			const value = await this.#client.get(prefixedKey);
			if (!value) {
				return null;
			}

			return JSON.parse(value) as T;
		} catch (error) {
			this.logger.error(
				`Failed to get cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Delete a single key
	 * @param key - Cache key (without prefix)
	 */
	async del(key: string): Promise<void> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			const result = await this.#client.del(prefixedKey);
			this.logger.debug(`Cache DEL: ${prefixedKey} (deleted: ${result})`);
		} catch (error) {
			this.logger.error(
				`Failed to delete cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Delete a single key by tag
	 * @param key - Cache key (without prefix)
	 */
	async delWithTags(tags: string[]): Promise<void> {
		try {
			const pipeline = this.#client.pipeline();
			for (const tag of tags) {
				const tagSetKey = `${this.#prefix}:tag:${tag}`;
				const keys = await this.#client.smembers(tagSetKey);
				if (keys.length > 0) {
					pipeline.del(...keys);
				}
				pipeline.del(tagSetKey);
			}
			await pipeline.exec();
		} catch (error) {
			this.logger.error(
				`Failed to delete cache key by tags "${tags.join(", ")}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Increase the integer value of a key by one
	 * @param key - Cache key (without prefix)
	 * @returns The new value after increment
	 */
	async incr(key: string): Promise<number> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			const newValue = await this.#client.incr(prefixedKey);
			this.logger.debug(`Cache INCR: ${prefixedKey} (new value: ${newValue})`);
			return newValue;
		} catch (error) {
			this.logger.error(
				`Failed to increment cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Decrease the integer value of a key by one
	 * @param key - Cache key (without prefix)
	 * @returns The new value after decrement
	 */
	async decr(key: string): Promise<number> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			const newValue = await this.#client.decr(prefixedKey);
			this.logger.debug(`Cache DECR: ${prefixedKey} (new value: ${newValue})`);
			return newValue;
		} catch (error) {
			this.logger.error(
				`Failed to decrement cache key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Delete multiple keys matching a pattern using SCAN (production-safe)
	 * IMPORTANT: This uses SCAN instead of KEYS to avoid blocking Redis
	 *
	 * @param pattern - Pattern to match (e.g., "user:*")
	 * @returns Number of keys deleted
	 */
	async deleteByPattern(pattern: string): Promise<number> {
		try {
			let cursor = "0";
			let deletedCount = 0;
			const batchSize = 100;
			const prefixedPattern = `${this.#prefix}:${pattern}`;

			do {
				// SCAN with pattern (manually prefixed)
				const [nextCursor, keys] = await this.#client.scan(
					cursor,
					"MATCH",
					prefixedPattern,
					"COUNT",
					batchSize,
				);
				cursor = nextCursor;

				if (keys.length > 0) {
					const deleted = await this.#client.del(...keys);
					deletedCount += deleted;
					this.logger.debug(`Deleted ${deleted} keys matching pattern "${prefixedPattern}"`);
				}
			} while (cursor !== "0");

			this.logger.info(`Total deleted: ${deletedCount} keys for pattern "${prefixedPattern}"`);
			return deletedCount;
		} catch (error) {
			this.logger.error(
				`Failed to delete keys by pattern "${pattern}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Delete all keys with the current prefix
	 * Uses SCAN for production safety
	 * @returns Number of keys deleted
	 */
	async deleteAll(): Promise<number> {
		return this.deleteByPattern("*");
	}

	/**
	 * Flush all keys from Redis (DANGER: affects entire Redis instance)
	 * Use with extreme caution in production
	 */
	async clear(): Promise<void> {
		try {
			await this.#client.flushall();
			this.logger.warn("Cache FLUSHALL executed - all Redis data cleared");
		} catch (error) {
			this.logger.error(
				`Failed to flush cache: ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Check if a key exists
	 * @param key - Cache key (without prefix)
	 * @returns true if key exists
	 */
	async exists(key: string): Promise<boolean> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			const result = await this.#client.exists(prefixedKey);
			return result === 1;
		} catch (error) {
			this.logger.error(
				`Failed to check existence of key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Get TTL (time to live) for a key
	 * @param key - Cache key (without prefix)
	 * @returns TTL in seconds, -1 if no expiration, -2 if key doesn't exist
	 */
	async ttl(key: string): Promise<number> {
		try {
			const prefixedKey = `${this.#prefix}:${key}`;
			return await this.#client.ttl(prefixedKey);
		} catch (error) {
			this.logger.error(
				`Failed to get TTL for key "${key}": ${error instanceof Error ? error.message : String(error)}`,
			);
			throw error;
		}
	}

	/**
	 * Close Redis connection gracefully
	 * Note: This closes the shared connection, affecting all CacheService instances
	 * Use with caution - typically only called during application shutdown
	 */
	async close(): Promise<void> {
		await closeRedisConnection();
	}

	/**
	 * Health check for monitoring
	 * @throws Error if Redis is not responding
	 */
	async checkHealth(): Promise<void> {
		try {
			const result = await this.#client.ping();
			if (result !== "PONG") {
				throw new Error(`Unexpected PING response: ${result}`);
			}
			this.logger.debug("Cache health check passed");
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.logger.error(`Cache health check failed: ${message}`);
			throw new Error(`Cache health check failed: ${message}`);
		}
	}
}
