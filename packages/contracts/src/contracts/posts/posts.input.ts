import {
	file,
	type InferInput,
	type InferOutput,
	maxLength,
	maxSize,
	mimeType,
	minLength,
	object,
	optional,
	picklist,
	pipe,
	regex,
	string,
	toDate,
	transform,
	uuid,
} from "valibot";
import { stringToBoolean, uuidSchema } from "../common-schemas";

const imageSchema = pipe(
	file("Vyberte obrázek článku."),
	mimeType(
		["image/jpeg", "image/png", "image/webp"],
		"Vyberte obrázek článku ve formátu JPEG, PNG nebo WEBP.",
	),
	maxSize(1024 * 1024 * 20, "Vyberte obrázek článku menší než 20 MB."),
);

export const PostFindBySlugInput = object({
	categoryslug: pipe(string(), minLength(1)),
	postslug: pipe(string(), minLength(1)),
});

export const PostFindBySlugDTO = PostFindBySlugInput;
export type PostFindBySlugDTO = InferInput<typeof PostFindBySlugDTO>;

const PostInput = object({
	title: pipe(string(), minLength(1), maxLength(120)),
	description: pipe(string(), minLength(1), maxLength(255)),
	tags: string(),
	content: string(),
	categoryId: pipe(string(), uuid()),
});

export const PostCreateInput = object({
	...PostInput.entries,
	public: picklist(["true", "false"]),
	publishAt: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/)),
	expiresAt: optional(
		pipe(
			pipe(
				string(),
				transform((v) => (v === "" ? undefined : v)),
			),
			pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/)),
		),
		undefined,
	),
	image: imageSchema,
});

export const PostUpdateInput = object({
	...PostCreateInput.entries,
	image: pipe(
		file(),
		transform((f) => (f.size === 0 ? undefined : f)),
		optional(imageSchema),
	),
});

export const PostCreateDTO = object({
	...PostInput.entries,
	public: stringToBoolean(),
	publishAt: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/), toDate()),
	expiresAt: optional(pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/), toDate()), undefined),
	image: imageSchema,
});

export const PostUpdateDTO = object({
	id: uuidSchema(),
	...PostCreateDTO.entries,
	image: optional(imageSchema),
});

export type PostCreateDTO = InferOutput<typeof PostCreateDTO>;
export type PostUpdateDTO = InferOutput<typeof PostUpdateDTO>;
