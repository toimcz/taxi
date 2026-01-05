import { implement, ORPCError } from "@orpc/server";
import { settingsAdminContract } from "@taxi/contracts";
import { settingsUseCases } from "./settings.use-cases";

const settingsOs = implement(settingsAdminContract);

const findAll = settingsOs.findAll.handler(async () => {
	return await settingsUseCases.findAll();
});

const findById = settingsOs.findById.handler(async ({ input }) => {
	const setting = await settingsUseCases.findById(input.id);
	if (!setting)
		throw new ORPCError("NOT_FOUND", { message: `Setting with id ${input.id} not found` });
	return setting;
});

const create = settingsOs.create.handler(async ({ input }) => {
	return await settingsUseCases.create(input);
});

const update = settingsOs.update.handler(async ({ input }) => {
	console.log(input);
	return await settingsUseCases.update(input);
});

const remove = settingsOs.delete.handler(async ({ input }) => {
	return await settingsUseCases.delete(input.id);
});

export const settingsAdminHandler = {
	findAll,
	findById,
	create,
	update,
	remove,
};
