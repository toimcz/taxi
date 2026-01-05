import { ORPCError } from "@orpc/contract";
import type { Driver, DriverCreateDTO, DriverItem, DriverUpdateDTO } from "@taxi/contracts";
import { db, drivers$ } from "@taxi/db";
import { asc, eq, sql } from "drizzle-orm";

const options = {
	with: {
		partner: {
			columns: {
				id: true,
				name: true,
			},
		},
	},
	extras: {
		fullName: sql<string>`CONCAT(${drivers$.firstName}, ' ', ${drivers$.lastName})`.as("fullName"),
	},
} as const;

const findAll = async (): Promise<DriverItem[]> => {
	const drivers = await db.query.drivers$.findMany({
		...options,
		orderBy: [asc(drivers$.lastName)],
	});
	return drivers.map((driver) => ({
		...driver,
		partnerName: driver.partner.name,
	}));
};

const findById = async (id: string): Promise<Driver | undefined> => {
	const driver = await db.query.drivers$.findFirst({
		where: eq(drivers$.id, id),
		...options,
	});
	return driver
		? {
				...driver,
				partnerName: driver.partner.name,
			}
		: undefined;
};

const create = async (input: DriverCreateDTO): Promise<Driver> => {
	const [created] = await db.insert(drivers$).values(input).returning();
	if (!created) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error creating driver" });
	const driver = await findById(created.id);
	if (!driver)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error fetching created driver" });
	return driver;
};

const update = async (input: DriverUpdateDTO): Promise<Driver> => {
	const [updated] = await db
		.update(drivers$)
		.set(input)
		.where(eq(drivers$.id, input.id))
		.returning();
	if (!updated) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error creating driver" });
	const driver = await findById(updated.id);
	if (!driver)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Error fetching created driver" });
	return driver;
};

export const driversUseCases = {
	findAll,
	findById,
	create,
	update,
};
