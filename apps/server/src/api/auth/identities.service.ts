import type { IdentityType } from "@taxi/contracts/common";
import { db } from "@taxi/db";
import {
	type IdentityInsert,
	type IdentitySelect,
	identities$,
} from "@taxi/db/schemas/auth";
import { and, eq } from "drizzle-orm";

export class IdentitiesService {
	static #instance: IdentitiesService;
	private readonly db = db;

	static get instance(): IdentitiesService {
		if (!IdentitiesService.#instance) {
			IdentitiesService.#instance = new IdentitiesService();
		}
		return IdentitiesService.#instance;
	}

	async findByProviderId(
		providerId: string,
		type: IdentityType,
	): Promise<IdentitySelect | undefined> {
		return this.db.query.identities$.findFirst({
			where: and(
				eq(identities$.providerId, providerId),
				eq(identities$.provider, type),
			),
		});
	}

	async create(identity: IdentityInsert): Promise<IdentitySelect> {
		const [newIdentity] = await this.db
			.insert(identities$)
			.values(identity)
			.returning();
		if (!newIdentity) {
			throw new Error("Failed to create identity");
		}
		return newIdentity;
	}

	async update(
		id: string,
		identity: Partial<IdentityInsert>,
	): Promise<IdentitySelect> {
		const [updatedIdentity] = await this.db
			.update(identities$)
			.set(identity)
			.where(eq(identities$.id, id))
			.returning();
		if (!updatedIdentity) {
			throw new Error("Failed to update identity");
		}
		return updatedIdentity;
	}
}
