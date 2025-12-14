import crypto from "node:crypto";
import { cache } from "@taxi/cache";
import type { IdentitySelect } from "@taxi/db/schemas/auth";
import { MagicLinksJobs } from "src/api/magic-links/magic-links.jobs";

const REDIS_MAGIC_LINKS_PREFIX = "magic-link:";
const MAGIC_LINK_EXPIRATION_TIME_MS = 1000 * 60 * 30; // 30 minutes in milliseconds
const MAGIC_LINK_EXPIRATION_TIME_SEC = Math.floor(
	MAGIC_LINK_EXPIRATION_TIME_MS / 1000,
); // Convert to seconds for Redis

export type MagicLink = {
	id: string;
	identityId: string;
	expiresAt: Date;
	redirectUrl: string;
};

export class MagicLinksService {
	static #instance: MagicLinksService;
	private readonly cache = cache;

	private constructor(private readonly magicLinkJobs: MagicLinksJobs) {}

	static get instance(): MagicLinksService {
		if (!MagicLinksService.#instance) {
			MagicLinksService.#instance = new MagicLinksService(
				MagicLinksJobs.instance,
			);
		}
		return MagicLinksService.#instance;
	}

	async sendMagicLink(
		identity: IdentitySelect,
		redirectUrl: string,
	): Promise<void> {
		const magicLink = {
			id: this.generateSafeUrlToken(),
			identityId: identity.id,
			expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRATION_TIME_MS),
			redirectUrl,
		};
		await this.cache.set(
			`${REDIS_MAGIC_LINKS_PREFIX}${magicLink.id}`,
			JSON.stringify(magicLink),
			"EX",
			MAGIC_LINK_EXPIRATION_TIME_SEC,
		);
		await this.magicLinkJobs.add("SEND_MAGIC_LINK", { identity, magicLink });
	}

	async getMagicLink(id: string): Promise<MagicLink | null> {
		const magicLink = await this.cache.get(`${REDIS_MAGIC_LINKS_PREFIX}${id}`);
		if (!magicLink) {
			return null;
		}
		const parsedMagicLink = JSON.parse(magicLink);
		if (parsedMagicLink.expiresAt < new Date()) {
			return null;
		}
		await this.cache.del(`${REDIS_MAGIC_LINKS_PREFIX}${id}`).catch(() => {
			// Ignore errors - magic link may already be deleted or cache may be unavailable
			// This makes the function idempotent
		});
		return parsedMagicLink;
	}

	private generateSafeUrlToken(): string {
		return crypto.randomBytes(32).toString("hex");
	}
}
