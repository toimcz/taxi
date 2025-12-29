import { implement, ORPCError } from "@orpc/server";
import { questionsAdminContract } from "@taxi/contracts";
import { questionsUseCases } from "./questions.use-cases";

const questionsOs = implement(questionsAdminContract);

const findAll = questionsOs.findAll.handler(async () => {
	return await questionsUseCases.findAll();
});

const findById = questionsOs.findById.handler(async ({ input }) => {
	const question = await questionsUseCases.findById(input.id);
	if (!question) {
		throw new ORPCError("NOT_FOUND", { message: "Question not found" });
	}
	return question;
});

const create = questionsOs.create.handler(async ({ input }) => {
	const createdQuestion = await questionsUseCases.create(input);
	if (!createdQuestion) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Question creation failed",
		});
	}
	return createdQuestion;
});

const update = questionsOs.update.handler(async ({ input }) => {
	const updatedQuestion = await questionsUseCases.update(input);
	if (!updatedQuestion) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Question update failed",
		});
	}
	return updatedQuestion;
});

export const questionsAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
