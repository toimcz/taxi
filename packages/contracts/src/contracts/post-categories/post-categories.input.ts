import { boolean, type InferInput, maxLength, minLength, object, pipe, string } from "valibot";
import { stringToBoolean, uuidSchema } from "../common-schemas";

export const PostCategoryCreateInput = object({
	name: pipe(string(), minLength(1), maxLength(120)),
	description: pipe(string(), minLength(1), maxLength(255)),
	status: stringToBoolean(),
});

export const PostCategoryUpdateInput = PostCategoryCreateInput;

export const PostCategoryCreateDTO = object({
	...PostCategoryCreateInput.entries,
	status: boolean(),
});

export const PostCategoryUpdateDTO = object({
	...PostCategoryCreateDTO.entries,
	id: uuidSchema(),
});

export const PostCategoryFindBySlugDTO = object({
	slug: pipe(string(), minLength(1)),
});

export type PostCategoryCreateDTO = InferInput<typeof PostCategoryCreateDTO>;
export type PostCategoryUpdateDTO = InferInput<typeof PostCategoryUpdateDTO>;
export type PostCategoryFindBySlugDTO = InferInput<typeof PostCategoryFindBySlugDTO>;
