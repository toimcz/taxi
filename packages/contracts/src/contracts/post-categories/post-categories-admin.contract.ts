import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PostCategoryCreateDTO, PostCategoryUpdateDTO } from "./post-categories.input";
import { PostCategory } from "./post-categories.output";

const tags = ["PostCategories"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/post-categories${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.output(array(PostCategory));

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(PostCategory);

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(PostCategoryCreateDTO)
	.output(PostCategory);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/"),
		tags,
	})
	.input(PostCategoryUpdateDTO)
	.output(PostCategory);

export const postCategoriesAdminContract = {
	findAll,
	findById,
	create,
	update,
};
