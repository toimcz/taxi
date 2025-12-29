import { implement, ORPCError } from "@orpc/server";
import { basesAdminContract } from "@taxi/contracts";
import { basesUseCases } from "./bases.use-cases";

const baseOs = implement(basesAdminContract);

const findAll = baseOs.findAll.handler(async ({ input }) => {
	const bases = await basesUseCases.findAll(input);
	return bases;
});

const findById = baseOs.findById.handler(async ({ input }) => {
	const base = await basesUseCases.findById(input.id);
	if (!base) {
		throw new ORPCError("NOT_FOUND", { message: "Base not found" });
	}
	return base;
});

const create = baseOs.create.handler(async ({ input }) => {
	const base = await basesUseCases.create(input);
	return base;
});

const update = baseOs.update.handler(async ({ input }) => {
	const base = await basesUseCases.update(input);
	return base;
});

export const basesAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
