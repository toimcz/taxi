import { implement, ORPCError } from "@orpc/server";
import { servicesWebContract } from "@taxi/contracts";
import { servicesUseCases } from "./services.use-cases";

const servicesOs = implement(servicesWebContract);

const findAll = servicesOs.findAll.handler(async () => {
	return await servicesUseCases.findAllPublic();
});

const findById = servicesOs.findBySlug.handler(async ({ input }) => {
	const service = await servicesUseCases.findBySlug(input.slug);
	if (!service) {
		throw new ORPCError("NOT_FOUND", { message: "Service not found" });
	}
	return service;
});

export const servicesWebHandler = {
	findAll,
	findById,
};
