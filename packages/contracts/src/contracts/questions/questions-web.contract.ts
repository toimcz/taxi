import { array } from "valibot";
import { contract } from "../contract";
import { Question } from "./questions.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/web/questions",
	})
	.output(array(Question));

export const questionsWebContract = {
	findAll,
};
