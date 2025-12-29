import { implement, ORPCError } from "@orpc/server";
import { servicesAdminContract } from "@taxi/contracts";
import { servicesUseCases } from "./services.use-cases";

const servicesOs = implement(servicesAdminContract);

const findAll = servicesOs.findAll.handler(async () => {
	return await servicesUseCases.findAll();
});

const findById = servicesOs.findById.handler(async ({ input }) => {
	const service = await servicesUseCases.findById(input.id);
	if (!service) {
		throw new ORPCError("NOT_FOUND", { message: "Service not found" });
	}
	return service;
});

const create = servicesOs.create.handler(async ({ input }) => {
	return await servicesUseCases.create(input);
});

const update = servicesOs.update.handler(async ({ input }) => {
	return await servicesUseCases.update(input);
});

export const servicesAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
