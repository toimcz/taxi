import { implement, ORPCError } from "@orpc/server";
import { carsAdminContract } from "@taxi/contracts";
import { carsUseCases } from "./cars.use-cases";

const carsOs = implement(carsAdminContract);

const findAll = carsOs.findAll.handler(async () => {
	return carsUseCases.findAll();
});

const findById = carsOs.findById.handler(async ({ input }) => {
	const car = await carsUseCases.findById(input.id);
	if (!car) throw new ORPCError("NOT_FOUND");
	return car;
});

const create = carsOs.create.handler(async ({ input }) => {
	return carsUseCases.create(input);
});

const update = carsOs.update.handler(async ({ input }) => {
	return carsUseCases.update(input);
});

export const carsAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
