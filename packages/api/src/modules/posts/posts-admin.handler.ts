import { implement, ORPCError } from "@orpc/server";
import { postsAdminContract, Role } from "@taxi/contracts";
import { adminGuard } from "../../guards/admin.guard";
import { rolesGuard } from "../../guards/roles.guard";
import { postsUseCases } from "./posts.use-cases";

const postsOs = implement(postsAdminContract).use(adminGuard);

const findAll = postsOs.findAll.handler(async ({ input }) => {
	return postsUseCases.findAll(input);
});

const findById = postsOs.findById.handler(async ({ input }) => {
	const post = await postsUseCases.findById(input.id);
	if (!post) throw new ORPCError("NOT_FOUND", { message: "Post not found" });
	return post;
});

const create = postsOs.create
	.use(rolesGuard([Role.EDITOR, Role.DEV]))
	.handler(async ({ input, context }) => {
		return await postsUseCases.create(input, context.session.user.id);
	});

const update = postsOs.update
	.use(rolesGuard([Role.EDITOR, Role.DEV]))
	.handler(async ({ input, context }) => {
		const post = await postsUseCases.findById(input.id);
		if (!post) throw new ORPCError("NOT_FOUND", { message: "Post not found" });
		return await postsUseCases.update(input, context.session.user.id);
	});

export const postsAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
