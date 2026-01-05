import { array, boolean, type InferOutput, object, omit, string } from "valibot";
import { Post } from "../posts/posts.output";

export const PostCategory = object({
	id: string(),
	name: string(),
	description: string(),
	slug: string(),
	status: boolean(),
});

export const PostCategoryWithPosts = object({
	...PostCategory.entries,
	posts: array(omit(Post, ["categoryId", "categoryName", "categorySlug"])),
});

export type PostCategory = InferOutput<typeof PostCategory>;
export type PostCategoryWithPosts = InferOutput<typeof PostCategoryWithPosts>;
