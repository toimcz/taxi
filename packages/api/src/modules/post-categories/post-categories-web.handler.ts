import { implement, ORPCError } from "@orpc/server";
import { postCategoriesWebContract } from "@taxi/contracts";
import { postCategoriesUseCases } from "./post-categories.use-cases";

const postCategoriesOs = implement(postCategoriesWebContract);

const findAll = postCategoriesOs.findAll.handler(async () => {
	return postCategoriesUseCases.findAllPublic();
});

const findBySlug = postCategoriesOs.findBySlug.handler(async ({ input }) => {
	const category = await postCategoriesUseCases.findBySlug(input.slug);
	if (!category) throw new ORPCError("NOT_FOUND", { message: "Category not found" });
	return category;
});

export const postCategoriesWebHandler = {
	findAll,
	findBySlug,
};
