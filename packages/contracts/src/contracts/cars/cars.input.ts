import {
	boolean,
	file,
	type InferOutput,
	integer,
	maxLength,
	maxSize,
	maxValue,
	mimeType,
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

const imageSchema = pipe(
	file("Chybí obrázek vozu"),
	mimeType(
		["image/jpeg", "image/png", "image/webp"],
		"Obrázek musí být ve formátu JPEG, PNG nebo WEBP",
	),
	maxSize(30 * 1024 * 1024, "Obrázek může mít maximálně 30MB"),
);

const CarInput = object({
	name: pipe(
		string("Chybí název vozu"),
		minLength(1, "Název vozu musí mít minimálně 1 znak"),
		maxLength(100, "Název vozu může mít maximálně 100 znaků"),
	),
	adminName: pipe(
		string("Chybí název vozu"),
		minLength(1, "Název vozu musí mít minimálně 1 znak"),
		maxLength(100, "Název vozu může mít maximálně 100 znaků"),
	),
	description: pipe(
		string("Chybí popis vozu"),
		minLength(1, "Popis vozu musí mít minimálně 1 znak"),
		maxLength(200, "Popis vozu může mít maximálně 200 znaků"),
	),
	types: pipe(
		string("Chybí typ vozu"),
		minLength(1, "Typ vozu musí mít minimálně 1 znak"),
		maxLength(100, "Typ vozu může mít maximálně 100 znaků"),
	),
	pax: pipe(
		string(),
		transform(Number),
		number("Chybí počet osob"),
		integer("Počet osob musí být celé číslo"),
		minValue(1, "Počet osob musí být alespoň 1"),
		maxValue(100, "Počet osob může být maximálně 100"),
	),
	luggage: pipe(
		number("Chybí počet zavadel"),
		transform(Number),
		integer("Počet zavadel musí být celé číslo"),
		minValue(1, "Počet zavadel musí být alespoň 1"),
		maxValue(100, "Počet zavadel může být maximálně 100"),
	),
	minPrice: pipe(
		string(),
		transform(Number),
		number("Chybí minimální cena"),
		minValue(0, "Minimální cena musí být alespoň 0"),
	),
	priceKm: pipe(
		string(),
		transform(Number),
		number("Chybí cena za kilometr"),
		minValue(0, "Cena za kilometr musí být alespoň 0"),
	),
	basePrice: pipe(
		string(),
		transform(Number),
		number("Chybí základní cena"),
		minValue(0, "Základní cena musí být alespoň 0"),
	),
	deposit: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean("Chybí nastavení depozitu"),
	),
	surge: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean("Chybí nastavení surge ceny"),
	),
	perPerson: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean("Chybí nastavení zda je cena za osobu"),
	),
	status: pipe(
		picklist(["true", "false"]),
		transform((value) => value === "true"),
		boolean("Chybí nastavení stavu"),
	),
	baseId: pipe(string(), uuid()),
	tags: optional(string(), ""),
});

const CarInputDTO = object({
	name: pipe(
		string("Chybí název vozu"),
		minLength(1, "Název vozu musí mít minimálně 1 znak"),
		maxLength(100, "Název vozu může mít maximálně 100 znaků"),
	),
	adminName: pipe(
		string("Chybí název vozu"),
		minLength(1, "Název vozu musí mít minimálně 1 znak"),
		maxLength(100, "Název vozu může mít maximálně 100 znaků"),
	),
	description: pipe(
		string("Chybí popis vozu"),
		minLength(1, "Popis vozu musí mít minimálně 1 znak"),
		maxLength(200, "Popis vozu může mít maximálně 200 znaků"),
	),
	types: pipe(
		string("Chybí typ vozu"),
		minLength(1, "Typ vozu musí mít minimálně 1 znak"),
		maxLength(100, "Typ vozu může mít maximálně 100 znaků"),
	),
	pax: pipe(
		number("Chybí počet osob"),
		minValue(1, "Počet osob musí být alespoň 1"),
		maxValue(100, "Počet osob může být maximálně 100"),
	),
	luggage: pipe(
		number("Chybí počet zavadel"),
		minValue(1, "Počet zavadel musí být alespoň 1"),
		maxValue(100, "Počet zavadel může být maximálně 100"),
	),
	minPrice: pipe(number("Chybí minimální cena"), minValue(0, "Minimální cena musí být alespoň 0")),
	priceKm: pipe(
		number("Chybí cena za kilometr"),
		minValue(0, "Cena za kilometr musí být alespoň 0"),
	),
	basePrice: pipe(number("Chybí základní cena"), minValue(0, "Základní cena musí být alespoň 0")),
	deposit: boolean("Chybí nastavení depozitu"),
	surge: boolean("Chybí nastavení surge ceny"),
	perPerson: boolean("Chybí nastavení zda je cena za osobu"),
	status: boolean("Chybí nastavení stavu"),
	baseId: pipe(string(), uuid()),
	tags: optional(string(), ""),
});

export const CarCreateInput = object({
	...CarInput.entries,
	image: imageSchema,
});

export const CarCreateInputDTO = object({
	...CarInputDTO.entries,
	image: imageSchema,
});

export type CarCreateDTO = InferOutput<typeof CarCreateInputDTO>;

export const CarUpdateInput = object({
	...CarInput.entries,
	image: optional(imageSchema),
});

export const CarUpdateInputDTO = object({
	...CarInputDTO.entries,
	image: optional(imageSchema),
});

export type CarUpdateDTO = InferOutput<typeof CarUpdateInputDTO>;
