import {
	boolean,
	type InferInput,
	integer,
	maxLength,
	minLength,
	number,
	object,
	pipe,
	string,
} from "valibot";
import { stringToBoolean, stringToNumber, uuidSchema } from "../common-schemas";

export const PageCreateInput = object({
	title: pipe(string(), minLength(1), maxLength(100)),
	description: pipe(string(), minLength(1), maxLength(255)),
	content: pipe(string(), minLength(1)),
	position: pipe(stringToNumber(), integer()),
	top: stringToBoolean(),
	bottom: stringToBoolean(),
	status: stringToBoolean(),
});

export const PageUpdateInput = PageCreateInput;

export const PageCreateDTO = object({
	title: pipe(string(), minLength(1), maxLength(100)),
	description: pipe(string(), minLength(1), maxLength(255)),
	content: pipe(string(), minLength(1)),
	position: pipe(number(), integer()),
	top: boolean(),
	bottom: boolean(),
	status: boolean(),
});

export const PageUpdateDTO = object({
	...PageCreateDTO.entries,
	id: uuidSchema(),
});

export type PageCreateDTO = InferInput<typeof PageCreateDTO>;
export type PageUpdateDTO = InferInput<typeof PageUpdateDTO>;

export const PageFindBySlug = object({
	slug: pipe(string(), minLength(1)),
});
export const PageFindBySlugDTO = PageFindBySlug;

export type PageFindBySlugDTO = InferInput<typeof PageFindBySlugDTO>;
