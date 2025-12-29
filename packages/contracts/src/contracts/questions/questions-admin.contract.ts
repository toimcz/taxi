import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { QuestionCreateDTO, QuestionUpdateDTO } from "./questions.input";
import { Question } from "./questions.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/questions",
	})
	.output(array(Question));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/questions/{id}",
	})
	.input(ParamUUID)
	.output(Question);
const create = contract
	.route({
		method: "POST",
		path: "/admin/questions",
	})
	.input(QuestionCreateDTO)
	.output(Question);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/questions/{id}",
	})
	.input(QuestionUpdateDTO)
	.output(Question);

export const questionsAdminContract = {
	findAll,
	findById,
	create,
	update,
};
