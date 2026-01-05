import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ApiData, PaginationParamsDTO } from "../common";
import { contract } from "../contract";
import { PostFindBySlugDTO } from "./posts.input";
import { Post } from "./posts.output";

const tags = ["Posts"];
const setPath = (path: HTTPPath): HTTPPath => `/web/posts${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.input(PaginationParamsDTO)
	.output(ApiData(array(Post)));

const findBySlug = contract
	.route({
		method: "GET",
		path: setPath("/slug/{categoryslug}/{postslug}"),
		tags,
	})
	.input(PostFindBySlugDTO)
	.output(Post);

export const postsWebContract = {
	findAll,
	findBySlug,
};
