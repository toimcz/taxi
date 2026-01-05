import { boolean, type InferOutput, number, object, pipe, string, uuid } from "valibot";
import { stringToDate } from "../common-schemas";

export const PageItem = object({
	id: pipe(string(), uuid()),
	slug: string(),
	title: string(),
	description: string(),
	top: boolean(),
	bottom: boolean(),
	status: boolean(),
	position: number(),
	createdAt: stringToDate(),
	updatedAt: stringToDate(),
});

export const Page = object({
	...PageItem.entries,
	content: string(),
});

export type Page = InferOutput<typeof Page>;
export type PageItem = InferOutput<typeof PageItem>;
