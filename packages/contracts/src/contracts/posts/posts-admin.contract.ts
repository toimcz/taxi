import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ApiData, PaginationParamsDTO, ParamUUID } from "../common";
import { contract } from "../contract";
import { PostCreateDTO, PostUpdateDTO } from "./posts.input";
import { Post } from "./posts.output";

const tags = ["Posts"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/posts${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.input(PaginationParamsDTO)
	.output(ApiData(array(Post)));

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Post);

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(PostCreateDTO)
	.output(Post);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/"),
		tags,
	})
	.input(PostUpdateDTO)
	.output(Post);

export const postsAdminContract = {
	findAll,
	findById,
	create,
	update,
};
