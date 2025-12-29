import { boolean, type InferInput, nullable, object, pipe, string, uuid } from "valibot";

export const Question = object({
	id: pipe(string(), uuid()),
	question: string(),
	categoryId: nullable(pipe(string(), uuid())),
	categoryName: nullable(string()),
	answer: string(),
	status: boolean(),
});

export type Question = InferInput<typeof Question>;
