import type { IdentityType } from "@taxi/contracts";
import { db, type IdentityInsert, type IdentitySelect, identities$ } from "@taxi/db";
import { and, eq } from "drizzle-orm";

async function findByProviderId(
	providerId: string,
	type: IdentityType,
): Promise<IdentitySelect | undefined> {
	return db.query.identities$.findFirst({
		where: and(eq(identities$.providerId, providerId), eq(identities$.provider, type)),
	});
}

async function findById(id: string): Promise<IdentitySelect | undefined> {
	return db.query.identities$.findFirst({
		where: eq(identities$.id, id),
	});
}

async function create(identity: IdentityInsert): Promise<IdentitySelect> {
	const [newIdentity] = await db.insert(identities$).values(identity).returning();
	if (!newIdentity) {
		throw new Error("Failed to create identity");
	}
	return newIdentity;
}

async function update(id: string, identity: Partial<IdentityInsert>): Promise<IdentitySelect> {
	const [updatedIdentity] = await db
		.update(identities$)
		.set(identity)
		.where(eq(identities$.id, id))
		.returning();
	if (!updatedIdentity) {
		throw new Error("Failed to update identity");
	}
	return updatedIdentity;
}

export const identitiesUseCases = {
	findByProviderId,
	findById,
	create,
	update,
};
