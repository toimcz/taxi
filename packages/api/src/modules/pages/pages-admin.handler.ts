import { implement, ORPCError } from "@orpc/server";
import { pagesAdminContract } from "@taxi/contracts";
import { pagesUseCases } from "./pages.use-cases";

const pagesOs = implement(pagesAdminContract);

const findAll = pagesOs.findAll.handler(async () => {
	return await pagesUseCases.findAll();
});

const findById = pagesOs.findById.handler(async ({ input }) => {
	const page = await pagesUseCases.findById(input.id);
	if (!page) throw new ORPCError("NOT_FOUND", { message: "Page not found" });
	return page;
});

const create = pagesOs.create.handler(async ({ input }) => {
	return await pagesUseCases.create(input);
});

const update = pagesOs.update.handler(async ({ input }) => {
	return await pagesUseCases.update(input);
});

const deletePage = pagesOs.delete.handler(async ({ input }) => {
	return await pagesUseCases.delete(input.id);
});

export const pagesAdminHandler = {
	findAll,
	findById,
	create,
	update,
	delete: deletePage,
};
