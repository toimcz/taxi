import { implement } from "@orpc/server";
import { questionsWebContract } from "@taxi/contracts";
import { questionsUseCases } from "./questions.use-cases";

const questionsOs = implement(questionsWebContract);

const findAll = questionsOs.findAll.handler(async () => {
	return await questionsUseCases.findAllPublic();
});

export const questionsWebHandler = {
	findAll,
};
