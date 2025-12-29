import {
	boolean,
	type InferOutput,
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

export const BaseCreateInput = object({
	city: pipe(
		string("Špatný formát města"),
		minLength(1, "Město nemůže být prázdné"),
		maxLength(100, "Maximální délka města může být 100 znaků"),
	),
	countryId: pipe(string("Špatný formát ID země"), uuid("Vyberte platnou zemi")),
	koeficient: pipe(
		string("Špatný formát koeficientu"),
		transform(Number),
		number("Špatný formát koeficientu"),
		minValue(1),
	),
	strength: pipe(
		string("Špatný formát síly základny"),
		transform(Number),
		number("Špatný formát síly základny"),
		minValue(0),
	),
	status: pipe(
		optional(picklist(["true", "false"]), "true"),
		transform((value) => value === "true"),
		boolean(),
	),
});

export const BaseCreateDTO = object({
	city: pipe(
		string("Špatný formát města"),
		minLength(1, "Město nemůže být prázdné"),
		maxLength(100, "Maximální délka města může být 100 znaků"),
	),
	countryId: pipe(string("Špatný formát ID země"), uuid("Vyberte platnou zemi")),
	koeficient: pipe(number("Špatný formát koeficientu"), minValue(1)),
	strength: pipe(number("Špatný formát síly základny"), minValue(0)),
	status: boolean(),
});

export type BaseCreateDTO = InferOutput<typeof BaseCreateDTO>;

export const BaseUpdateInput = object({
	koeficient: pipe(
		string("Špatný formát koeficientu"),
		transform(Number),
		number("Špatný formát koeficientu"),
		minValue(1),
	),
	strength: pipe(
		string("Špatný formát síly základny"),
		transform(Number),
		number("Špatný formát síly základny"),
		minValue(0),
	),
	status: pipe(
		optional(picklist(["true", "false"]), "true"),
		transform((value) => value === "true"),
		boolean(),
	),
});

export const BaseUpdateDTO = object({
	id: pipe(string("Špatný formát ID"), uuid("ID musí být validní UUID")),
	koeficient: pipe(number("Špatný formát koeficientu"), minValue(1)),
	strength: pipe(number("Špatný formát síly základny"), minValue(0)),
	status: optional(boolean(), true),
});

export type BaseUpdateDTO = InferOutput<typeof BaseUpdateDTO>;
