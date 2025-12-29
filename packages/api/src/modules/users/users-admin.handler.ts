import { implement, ORPCError } from "@orpc/server";
import { usersAdminContract } from "@taxi/contracts";
import { usersUseCases } from "./users.use-cases";

const usersOs = implement(usersAdminContract);

const findAll = usersOs.findAll.handler(({ input }) => {
	return usersUseCases.findAll(input);
});

const findById = usersOs.findById.handler(async ({ input }) => {
	const user = await usersUseCases.findById(input.id);
	if (!user) {
		throw new ORPCError("NOT_FOUND", { message: "User not found" });
	}
	return user;
});

const findByEmail = usersOs.findByEmail.handler(async ({ input }) => {
	const user = await usersUseCases.findByEmail(input.email);
	if (!user) {
		throw new ORPCError("NOT_FOUND", { message: "User not found" });
	}
	return user;
});

const search = usersOs.search.handler(({ input }) => {
	return usersUseCases.search(input.query);
});

const create = usersOs.create.handler(({ input }) => {
	return usersUseCases.create(input);
});

const update = usersOs.update.handler(({ input }) => {
	return usersUseCases.update(input.id, input);
});

export const usersAdminHandler = {
	findAll,
	findById,
	findByEmail,
	search,
	create,
	update,
};
