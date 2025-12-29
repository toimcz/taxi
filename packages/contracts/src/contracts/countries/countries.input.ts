import {
	boolean,
	type InferOutput,
	minLength,
	minValue,
	number,
	object,
	omit,
	optional,
	picklist,
	pipe,
	string,
	transform,
	uuid,
} from "valibot";

export const CountryCreateInput = object({
	name: pipe(string(), minLength(1)),
	koeficient: pipe(string(), transform(Number), minValue(1)),
	from: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean(),
	),
	to: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean(),
	),
	in: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean(),
	),
	status: pipe(
		optional(picklist(["true", "false"]), "true"),
		transform((value) => value === "true"),
		boolean(),
	),
});

export const CountryUpdateInput = omit(CountryCreateInput, ["name"]);

export const CountryCreateDTO = object({
	name: pipe(string(), minLength(1)),
	koeficient: number(),
	from: boolean(),
	to: boolean(),
	in: boolean(),
	status: optional(boolean(), true),
});

export type CountryCreateDTO = InferOutput<typeof CountryCreateDTO>;

export const CountryUpdateDTO = object({
	...omit(CountryCreateDTO, ["name"]).entries,
	id: pipe(string(), uuid()),
});

export type CountryUpdateDTO = InferOutput<typeof CountryUpdateDTO>;
