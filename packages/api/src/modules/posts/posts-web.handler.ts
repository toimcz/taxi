import { implement, ORPCError } from "@orpc/server";
import { postsWebContract } from "@taxi/contracts";
import { postsUseCases } from "./posts.use-cases";

const postsOs = implement(postsWebContract);

const findAll = postsOs.findAll.handler(async ({ input }) => {
	return await postsUseCases.findAllPublic(input);
});

const findBySlug = postsOs.findBySlug.handler(async ({ input }) => {
	const post = await postsUseCases.findBySlug(input);
	if (!post) throw new ORPCError("NOT_FOUND", { message: "Post not found" });
	return post;
});

export const postsWebHandler = {
	findAll,
	findBySlug,
};
