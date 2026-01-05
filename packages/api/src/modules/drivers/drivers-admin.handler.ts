import { implement, ORPCError } from "@orpc/server";
import { driversAdminContract } from "@taxi/contracts";
import { driversUseCases } from "./drivers.use-cases";

const driversOs = implement(driversAdminContract);

const findAll = driversOs.findAll.handler(async () => {
	return await driversUseCases.findAll();
});

const findById = driversOs.findById.handler(async ({ input }) => {
	const driver = await driversUseCases.findById(input.id);
	if (!driver) throw new ORPCError("NOT_FOUND", { message: "Driver not found" });
	return driver;
});

const create = driversOs.create.handler(async ({ input }) => {
	return await driversUseCases.create(input);
});

const update = driversOs.update.handler(async ({ input }) => {
	const driver = await driversUseCases.findById(input.id);
	if (!driver) throw new ORPCError("NOT_FOUND", { message: "Driver not found" });
	return await driversUseCases.update(input);
});

export const driversAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
