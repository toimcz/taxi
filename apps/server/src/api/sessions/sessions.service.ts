import { cache } from "@taxi/cache";
import { Session } from "@taxi/contracts/sessions/session";
import { logger } from "@taxi/logger";
import { UsersService } from "src/api/users/users.service";
import { safeParse } from "valibot";

const REDIS_SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds
const SESSION_EXPIRATION_TIME_SEC = Math.floor(
	SESSION_EXPIRATION_TIME_MS / 1000,
); // Convert to seconds for Redis

export class SessionsService {
	static #instance: SessionsService;
	private readonly cache = cache;
	private readonly usersService: UsersService;

	private constructor(usersService: UsersService) {
		this.usersService = usersService;
	}

	static get instance(): SessionsService {
		if (!SessionsService.#instance) {
			SessionsService.#instance = new SessionsService(UsersService.instance);
		}
		return SessionsService.#instance;
	}

	/**
	 * Checks if a session is expired based on its expiresAt timestamp
	 */
	private isSessionExpired(expiresAt: string): boolean {
		return new Date(expiresAt).getTime() < Date.now();
	}

	/**
	 * Safely deletes a session from cache, ignoring errors
	 */
	private async safeDeleteSession(sessionId: string): Promise<void> {
		await this.cache.del(`${REDIS_SESSION_PREFIX}${sessionId}`).catch(() => {
			// Ignore errors during cleanup - session may already be deleted
		});
	}

	async getSession(sessionId: string): Promise<Session | null> {
		const sessionData = await this.cache.get(
			`${REDIS_SESSION_PREFIX}${sessionId}`,
		);
		if (!sessionData) {
			return null;
		}

		let parsedData: unknown;
		try {
			parsedData = JSON.parse(sessionData);
		} catch {
			return null;
		}

		if (!parsedData) {
			return null;
		}

		const validationResult = safeParse(Session, parsedData);
		if (!validationResult.success) {
			logger.error(
				`Invalid session data: ${JSON.stringify(validationResult.issues, null, 2)}`,
			);
			return null;
		}

		const validated = validationResult.output;

		// Check expiration - expiresAt is an ISO string
		if (this.isSessionExpired(validated.session.expiresAt)) {
			// Session expired, clean it up
			await this.safeDeleteSession(sessionId);
			return null;
		}

		return validated;
	}

	async createSession(userId: string): Promise<Session> {
		const sessionId = Bun.randomUUIDv7();
		const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME_MS);
		const session = {
			sessionId,
			userId,
			expiresAt: expiresAt.toISOString(),
		};
		const user = await this.usersService.update(userId, {
			lastLoginAt: new Date(),
		});
		if (!user) {
			throw new Error("User not found");
		}

		const sessionData = { session, user };
		try {
			await this.cache.set(
				`${REDIS_SESSION_PREFIX}${sessionId}`,
				JSON.stringify(sessionData),
				"EX",
				SESSION_EXPIRATION_TIME_SEC,
			);
		} catch (error) {
			// If cache set fails, throw a more descriptive error
			throw new Error(
				`Failed to store session in cache: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}

		return sessionData;
	}

	async deleteSession(sessionId: string): Promise<void> {
		await this.cache.del(`${REDIS_SESSION_PREFIX}${sessionId}`).catch(() => {
			// Ignore errors - session may already be deleted or cache may be unavailable
			// This makes the function idempotent
		});
	}

	async refreshSession(sessionId: string): Promise<Session> {
		const cachedSessionData = await this.cache.get(
			`${REDIS_SESSION_PREFIX}${sessionId}`,
		);
		if (!cachedSessionData) {
			throw new Error("Session not found");
		}

		let parsedData: unknown;
		try {
			parsedData = JSON.parse(cachedSessionData);
		} catch {
			throw new Error("Invalid session data");
		}

		const validationResult = safeParse(Session, parsedData);
		if (!validationResult.success) {
			throw new Error("Invalid session format");
		}

		const validated = validationResult.output;

		// Check if session is already expired
		if (this.isSessionExpired(validated.session.expiresAt)) {
			// Clean up expired session
			await this.safeDeleteSession(sessionId);
			throw new Error("Session expired");
		}

		// User is guaranteed to exist because Session schema requires it
		// If validation passed, validated.user will always be present
		const user = validated.user;

		const refreshedSession = {
			...validated.session,
			expiresAt: new Date(
				Date.now() + SESSION_EXPIRATION_TIME_MS,
			).toISOString(),
		};

		const sessionData: Session = { session: refreshedSession, user };
		try {
			await this.cache.set(
				`${REDIS_SESSION_PREFIX}${sessionId}`,
				JSON.stringify(sessionData),
				"EX",
				SESSION_EXPIRATION_TIME_SEC,
			);
		} catch (error) {
			// If cache set fails, throw a more descriptive error
			throw new Error(
				`Failed to refresh session in cache: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}

		return sessionData;
	}
}
