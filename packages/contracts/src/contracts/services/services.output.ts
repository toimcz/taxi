import { boolean, type InferOutput, number, object, pipe, string, uuid } from "valibot";

export const Service = object({
	id: pipe(string(), uuid()),
	position: number(),
	slug: string(),
	title: string(),
	description: string(),
	content: string(),
	photo: string(),
	status: boolean(),
});

export type Service = InferOutput<typeof Service>;
