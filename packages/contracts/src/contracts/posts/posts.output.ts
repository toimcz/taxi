import {
	array,
	boolean,
	type InferOutput,
	maxLength,
	minLength,
	nullable,
	object,
	pipe,
	string,
	uuid,
} from "valibot";
import { stringToDate } from "../common-schemas";

export const Post = object({
	id: pipe(string(), uuid()),
	title: pipe(string(), minLength(1), maxLength(120)),
	description: pipe(string(), minLength(1), maxLength(255)),
	slug: string(),
	tags: array(string()),
	content: string(),
	public: boolean(),
	photo: string(),
	url: string(),
	categoryId: pipe(string(), uuid()),
	categoryName: string(),
	categorySlug: string(),
	createdAt: stringToDate(),
	updatedAt: stringToDate(),
	publishAt: stringToDate(),
	expiresAt: nullable(stringToDate()),
});

export type Post = InferOutput<typeof Post>;
