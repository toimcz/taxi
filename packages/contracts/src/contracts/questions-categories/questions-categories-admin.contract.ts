import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import {
	QuestionsCategoryCreateDTO,
	QuestionsCategoryUpdateDTO,
} from "./questions-categories.input";
import { QuestionsCategory } from "./questions-categories.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/questions-categories",
	})
	.output(array(QuestionsCategory));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/questions-categories/{id}",
	})
	.input(ParamUUID)
	.output(QuestionsCategory);
const create = contract
	.route({
		method: "POST",
		path: "/admin/questions-categories",
	})
	.input(QuestionsCategoryCreateDTO)
	.output(QuestionsCategory);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/questions-categories/{id}",
	})
	.input(QuestionsCategoryUpdateDTO)
	.output(QuestionsCategory);

export const questionsCategoriesAdminContract = {
	findAll,
	findById,
	create,
	update,
};
