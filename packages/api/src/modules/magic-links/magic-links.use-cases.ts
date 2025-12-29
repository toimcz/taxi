import crypto from "node:crypto";
import type { IdentitySelect } from "@taxi/db";
import { CacheService } from "../../lib/cache";
import { MagicLinksJobs } from "./magic-links.jobs";

const REDIS_MAGIC_LINKS_PREFIX = "magic-link:";
const MAGIC_LINK_EXPIRATION_TIME_MS = 1000 * 60 * 30; // 30 minutes in milliseconds
const MAGIC_LINK_EXPIRATION_TIME_SEC = Math.floor(MAGIC_LINK_EXPIRATION_TIME_MS / 1000); // Convert to seconds for Redis

export type MagicLink = {
	id: string;
	identityId: string;
	expiresAt: Date;
	redirectUrl: string;
};

const cache = new CacheService("magic-links-cache");
const magicLinkJobs = new MagicLinksJobs();

const sendMagicLink = async (identity: IdentitySelect, redirectUrl: string): Promise<void> => {
	const magicLink = {
		id: generateSafeUrlToken(),
		identityId: identity.id,
		expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRATION_TIME_MS),
		redirectUrl,
	};
	await cache.set(
		`${REDIS_MAGIC_LINKS_PREFIX}${magicLink.id}`,
		magicLink,
		MAGIC_LINK_EXPIRATION_TIME_SEC,
	);
	await magicLinkJobs.add("SEND_MAGIC_LINK", { identity, magicLink });
};

const getMagicLink = async (id: string): Promise<MagicLink | null> => {
	const magicLink = await cache.get<MagicLink>(`${REDIS_MAGIC_LINKS_PREFIX}${id}`);
	if (!magicLink) {
		return null;
	}
	// Convert string date back to Date object before comparison
	const expiresAt = new Date(magicLink.expiresAt);
	if (expiresAt.getTime() < Date.now()) {
		return null;
	}
	await cache.del(`${REDIS_MAGIC_LINKS_PREFIX}${id}`).catch(() => {
		// Ignore errors - magic link may already be deleted or cache may be unavailable
		// This makes the function idempotent
	});
	return magicLink;
};

export const magicLinksUseCases = {
	sendMagicLink,
	getMagicLink,
};

function generateSafeUrlToken(): string {
	return crypto.randomBytes(32).toString("hex");
}
