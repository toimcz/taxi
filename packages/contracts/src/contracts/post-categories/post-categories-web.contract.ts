import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { contract } from "../contract";
import { PostCategoryFindBySlugDTO } from "./post-categories.input";
import { PostCategory, PostCategoryWithPosts } from "./post-categories.output";

const tags = ["PostCategories"];
const setPath = (path: HTTPPath): HTTPPath => `/web/post-categories${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.output(array(PostCategory));

const findBySlug = contract
	.route({
		method: "GET",
		path: setPath("/slug/{slug}"),
		tags,
	})
	.input(PostCategoryFindBySlugDTO)
	.output(PostCategoryWithPosts);

export const postCategoriesWebContract = {
	findAll,
	findBySlug,
};
