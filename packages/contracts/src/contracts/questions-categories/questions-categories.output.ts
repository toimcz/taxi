import { boolean, type InferOutput, number, object, pipe, string, uuid } from "valibot";

export const QuestionsCategory = object({
	id: pipe(string(), uuid()),
	name: string(),
	order: number(),
	slug: string(),
	description: string(),
	status: boolean(),
});

export type QuestionsCategory = InferOutput<typeof QuestionsCategory>;
