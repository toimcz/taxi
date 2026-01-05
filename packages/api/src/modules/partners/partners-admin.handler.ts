import { implement } from "@orpc/server";
import { partnersAdminContract } from "@taxi/contracts";
import { partnersUseCases } from "./partners.use-cases";

const partnersOs = implement(partnersAdminContract);

const findAll = partnersOs.findAll.handler(async () => {
	return partnersUseCases.findAll();
});

const findById = partnersOs.findById.handler(async ({ input }) => {
	const partner = await partnersUseCases.findById(input.id);
	if (!partner) throw new Error("Partner not found");
	return partner;
});

const create = partnersOs.create.handler(async ({ input }) => {
	return partnersUseCases.create(input);
});

const update = partnersOs.update.handler(async ({ input }) => {
	return partnersUseCases.update(input.id, input);
});

export const partnersAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
