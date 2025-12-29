import {
	boolean,
	type InferInput,
	maxLength,
	minLength,
	object,
	picklist,
	pipe,
	string,
	transform,
	uuid,
} from "valibot";

const QuestionInput = object({
	categoryId: pipe(string(), uuid()),
	question: pipe(
		string(),
		minLength(1, "Vyplňte otázku"),
		maxLength(200, "Otázka může mít maximálně 200 znaků"),
	),
	answer: pipe(
		string(),
		minLength(1, "Vyplňte odpověď"),
		maxLength(1000, "Odpověď může mít maximálně 1000 znaků"),
	),
});

export const QuestionCreateInput = object({
	...QuestionInput.entries,
	status: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean(),
	),
});

export const QuestionUpdateInput = QuestionCreateInput;
export const QuestionCreateDTO = object({
	...QuestionCreateInput.entries,
	status: boolean(),
});
export const QuestionUpdateDTO = object({
	id: pipe(string(), uuid()),
	...QuestionCreateDTO.entries,
});

export type QuestionCreateDTO = InferInput<typeof QuestionCreateDTO>;
export type QuestionUpdateDTO = InferInput<typeof QuestionUpdateDTO>;
