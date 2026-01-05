import { ORPCError } from "@orpc/contract";
import type { Partner, PartnerCreateDTO, PartnerItem, PartnerUpdateDTO } from "@taxi/contracts";
import { db, drivers$, partners$ } from "@taxi/db";
import { eq, sql } from "drizzle-orm";

const findAll = async (): Promise<PartnerItem[]> => {
	return db.query.partners$.findMany();
};

const findById = async (id: string): Promise<Partner | undefined> => {
	return db.query.partners$.findFirst({
		with: {
			drivers: {
				columns: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true,
					status: true,
				},
				extras: {
					fullName: sql<string>`CONCAT(${drivers$.lastName}, ' ', ${drivers$.firstName})`.as(
						"fullName",
					),
				},
			},
		},
		where: eq(partners$.id, id),
	});
};

const create = async (input: PartnerCreateDTO): Promise<Partner> => {
	const [created] = await db.insert(partners$).values(input).returning();
	if (!created) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error creating partner" });
	const partner = await findById(created.id);
	if (!partner)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error retrieving created partner" });
	return partner;
};

const update = async (id: string, input: Partial<PartnerUpdateDTO>): Promise<Partner> => {
	await db.update(partners$).set(input).where(eq(partners$.id, id));
	const partner = await findById(id);
	if (!partner)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error retrieving updated partner" });
	return partner;
};

export const partnersUseCases = {
	findAll,
	findById,
	create,
	update,
};
