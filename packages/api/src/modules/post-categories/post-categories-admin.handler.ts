import { implement, ORPCError } from "@orpc/server";
import { postCategoriesAdminContract } from "@taxi/contracts";
import { postCategoriesUseCases } from "./post-categories.use-cases";

const postCategoriesOs = implement(postCategoriesAdminContract);

const findAll = postCategoriesOs.findAll.handler(async () => {
	return postCategoriesUseCases.findAll();
});

const findById = postCategoriesOs.findById.handler(async ({ input }) => {
	const category = await postCategoriesUseCases.findById(input.id);
	if (!category) throw new ORPCError("NOT_FOUND", { message: "Post category not found" });
	return category;
});

const create = postCategoriesOs.create.handler(async ({ input }) => {
	return postCategoriesUseCases.create(input);
});

const update = postCategoriesOs.update.handler(async ({ input }) => {
	return postCategoriesUseCases.update(input);
});

export const postCategoriesAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
