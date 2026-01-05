import {
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
import { stringToBoolean, stringToNumber, uuidSchema } from "../common-schemas";

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
});

const CarInputDTO = object({
	...CarInput.entries,
	pax: pipe(
		stringToNumber("Chybí počet osob"),
		number("Chybí počet osob"),
		integer("Počet osob musí být celé číslo"),
		minValue(1, "Počet osob musí být alespoň 1"),
		maxValue(100, "Počet osob může být maximálně 100"),
	),
	luggage: pipe(
		stringToNumber("Chybí počet zavadel"),
		number("Chybí počet zavadel"),
		integer("Počet zavadel musí být celé číslo"),
		minValue(1, "Počet zavadel musí být alespoň 1"),
		maxValue(100, "Počet zavadel může být maximálně 100"),
	),
	minPrice: pipe(
		stringToNumber("Chybí minimální cena"),
		number("Chybí minimální cena"),
		minValue(0, "Minimální cena musí být alespoň 0"),
	),
	priceKm: pipe(
		stringToNumber("Chybí cena za kilometr"),
		number("Chybí cena za kilometr"),
		minValue(0, "Cena za kilometr musí být alespoň 0"),
	),
	basePrice: pipe(
		stringToNumber("Chybí základní cena"),
		number("Chybí základní cena"),
		minValue(0, "Základní cena musí být alespoň 0"),
	),
	deposit: stringToBoolean("Chybí nastavení depozitu"),
	surge: stringToBoolean("Chybí nastavení surge ceny"),
	perPerson: stringToBoolean("Chybí nastavení zda je cena za osobu"),
	status: stringToBoolean("Chybí nastavení stavu"),
	baseId: pipe(string(), uuid()),
	tags: optional(string(), ""),
});

export const CarCreateInput = object({
	...CarInput.entries,
	pax: pipe(
		stringToNumber(),
		number("Chybí počet osob"),
		integer("Počet osob musí být celé číslo"),
		minValue(1, "Počet osob musí být alespoň 1"),
		maxValue(100, "Počet osob může být maximálně 100"),
		transform((v) => String(v)),
	),
	luggage: pipe(
		stringToNumber(),
		number("Chybí počet zavadel"),
		integer("Počet zavadel musí být celé číslo"),
		minValue(1, "Počet zavadel musí být alespoň 1"),
		maxValue(100, "Počet zavadel může být maximálně 100"),
		transform((v) => String(v)),
	),
	minPrice: pipe(
		stringToNumber(),
		number("Chybí minimální cena"),
		minValue(1, "Minimální cena musí být alespoň 0"),
		transform((v) => String(v)),
	),
	priceKm: pipe(
		stringToNumber(),
		number("Chybí cena za kilometr"),
		minValue(1, "Cena za kilometr musí být alespoň 0"),
		transform((v) => String(v)),
	),
	basePrice: pipe(
		stringToNumber(),
		number("Chybí základní cena"),
		minValue(0, "Základní cena musí být alespoň 0"),
		transform((v) => String(v)),
	),
	deposit: picklist(["true", "false"], "Chybí nastavení depozitu"),
	surge: picklist(["true", "false"], "Chybí nastavení surge ceny"),
	perPerson: picklist(["true", "false"], "Chybí nastavení zda je cena za osobu"),
	status: picklist(["true", "false"], "Chybí nastavení stavu"),
	tags: optional(string(), ""),
	image: imageSchema,
});

export const CarUpdateInput = object({
	...CarCreateInput.entries,
	image: pipe(
		file(),
		transform((f) => (f.size === 0 ? undefined : f)),
		optional(imageSchema),
	),
});

export const CarCreateDTO = object({
	...CarInputDTO.entries,
	image: imageSchema,
});

export type CarCreateDTO = InferOutput<typeof CarCreateDTO>;

export const CarUpdateDTO = object({
	id: uuidSchema(),
	...CarInputDTO.entries,
	image: optional(imageSchema),
});

export type CarUpdateDTO = InferOutput<typeof CarUpdateDTO>;
