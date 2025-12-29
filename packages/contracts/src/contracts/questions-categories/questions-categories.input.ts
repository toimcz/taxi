import {
	boolean,
	type InferInput,
	integer,
	maxLength,
	minLength,
	minValue,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
	transform,
	uuid,
} from "valibot";

const QuestionsCategoryInput = object({
	name: pipe(
		string(),
		minLength(1, "Vyplňte název kategorie"),
		maxLength(100, "Název kategorie může mít maximálně 100 znaků"),
	),
	description: optional(
		pipe(string(), maxLength(500, "Popis kategorie může mít maximálně 500 znaků")),
		"",
	),
});

export const QuestionsCategoryCreateInput = object({
	...QuestionsCategoryInput.entries,
	order: pipe(optional(string(), "0"), transform(Number), integer(), minValue(0)),
	status: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
	),
});

export const QuestionsCategoryCreateDTO = object({
	...QuestionsCategoryInput.entries,
	order: optional(number(), 0),
	status: boolean(),
});

export const QuestionsCategoryUpdateInput = object({
	...QuestionsCategoryCreateInput.entries,
	id: pipe(string(), uuid()),
});

export const QuestionsCategoryUpdateDTO = object({
	...QuestionsCategoryCreateDTO.entries,
	id: pipe(string(), uuid()),
});

export type QuestionsCategoryCreateDTO = InferInput<typeof QuestionsCategoryCreateDTO>;
export type QuestionsCategoryUpdateDTO = InferInput<typeof QuestionsCategoryUpdateDTO>;
