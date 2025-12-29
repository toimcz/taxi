import { implement, ORPCError } from "@orpc/server";
import { questionsCategoriesAdminContract } from "@taxi/contracts";
import { questionsCategoriesUseCases } from "./questions-categories.use-cases";

const questionsCategoriesOs = implement(questionsCategoriesAdminContract);

const findAll = questionsCategoriesOs.findAll.handler(async () => {
	return await questionsCategoriesUseCases.findAll();
});

const findById = questionsCategoriesOs.findById.handler(async ({ input }) => {
	const category = await questionsCategoriesUseCases.findById(input.id);
	if (!category) {
		throw new ORPCError("NOT_FOUND", { message: "Kategorie nebyla nalezena" });
	}
	return category;
});

const create = questionsCategoriesOs.create.handler(async ({ input }) => {
	const category = await questionsCategoriesUseCases.create(input);
	if (!category) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Kategorie se nepodařilo vytvořit",
		});
	}
	return category;
});

const update = questionsCategoriesOs.update.handler(async ({ input }) => {
	const category = await questionsCategoriesUseCases.update(input);
	if (!category) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Kategorie se nepodařilo aktualizovat",
		});
	}
	return category;
});

export const questionsCategoriesAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
