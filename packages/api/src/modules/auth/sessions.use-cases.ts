import { Session } from "@taxi/contracts";
import { v7 as uuidv7 } from "uuid";
import { safeParse } from "valibot";
import { CacheService } from "../../lib/cache";
import { Logger } from "../../lib/logger";
import { usersUseCases } from "../users";

const REDIS_SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_TIME_MS = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds
const SESSION_EXPIRATION_TIME_SEC = Math.floor(SESSION_EXPIRATION_TIME_MS / 1000); // Convert to seconds for Redis

const logger = new Logger("sessions-service");
const cache = new CacheService("sessions-service");

/**
 * Checks if a session is expired based on its expiresAt timestamp
 */
function isSessionExpired(expiresAt: Date): boolean {
	return expiresAt.getTime() < Date.now();
}

/**
 * Safely deletes a session from cache, ignoring errors
 */
async function safeDeleteSession(sessionId: string): Promise<void> {
	await cache.del(`${REDIS_SESSION_PREFIX}${sessionId}`).catch(() => {
		// Ignore errors during cleanup - session may already be deleted
	});
}

async function getSession(sessionId: string): Promise<Session | null> {
	const sessionData = await cache.get<Session>(`${REDIS_SESSION_PREFIX}${sessionId}`);
	if (!sessionData) {
		return null;
	}

	const validationResult = safeParse(Session, sessionData);
	if (!validationResult.success) {
		logger.error(`Invalid session data: ${JSON.stringify(validationResult.issues, null, 2)}`);
		return null;
	}

	const validated = validationResult.output;

	// Check expiration - expiresAt is an ISO string
	if (isSessionExpired(validated.session.expiresAt)) {
		// Session expired, clean it up
		await safeDeleteSession(sessionId);
		return null;
	}

	return validated;
}

async function createSession(userId: string): Promise<Session> {
	const sessionId = uuidv7();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME_MS);
	const session = {
		sessionId,
		userId,
		expiresAt,
	};
	const user = await usersUseCases.findByIdAndUpdateLastLoginAt(userId);
	if (!user) {
		throw new Error("User not found");
	}

	const sessionData = { session, user };
	try {
		await cache.set(
			`${REDIS_SESSION_PREFIX}${sessionId}`,
			sessionData,
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

async function deleteSession(sessionId: string): Promise<void> {
	await cache.del(`${REDIS_SESSION_PREFIX}${sessionId}`).catch(() => {
		// Ignore errors - session may already be deleted or cache may be unavailable
		// This makes the function idempotent
	});
}

async function refreshSession(sessionId: string): Promise<Session> {
	const cachedSessionData = await cache.get<Session>(`${REDIS_SESSION_PREFIX}${sessionId}`);
	if (!cachedSessionData) {
		throw new Error("Session not found");
	}

	const validationResult = safeParse(Session, cachedSessionData);
	if (!validationResult.success) {
		throw new Error("Invalid session format");
	}

	const validated = validationResult.output;

	// Check if session is already expired
	if (isSessionExpired(validated.session.expiresAt)) {
		// Clean up expired session
		await safeDeleteSession(sessionId);
		throw new Error("Session expired");
	}

	// User is guaranteed to exist because Session schema requires it
	// If validation passed, validated.user will always be present
	const user = validated.user;

	const refreshedSession = {
		...validated.session,
		expiresAt: new Date(Date.now() + SESSION_EXPIRATION_TIME_MS),
	};

	const sessionData: Session = { session: refreshedSession, user };
	try {
		await cache.set(
			`${REDIS_SESSION_PREFIX}${sessionId}`,
			sessionData,
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

export const sessionsUseCases = {
	getSession,
	createSession,
	deleteSession,
	refreshSession,
};
