import {
	boolean,
	file,
	type InferInput,
	maxSize,
	mimeType,
	minLength,
	minValue,
	number,
	object,
	optional,
	pipe,
	string,
} from "valibot";
import { stringToBoolean, stringToNumber, uuidSchema } from "../common-schemas";

const imageSchema = pipe(
	file("Chybí obrázek služby  "),
	mimeType(
		["image/jpeg", "image/png", "image/webp"],
		"Obrázek musí být ve formátu JPEG, PNG nebo WEBP",
	),
	maxSize(30 * 1024 * 1024, "Obrázek může mít maximálně 30MB"),
);

const ServiceInput = object({
	title: pipe(string(), minLength(1, "Chybí název služby")),
	description: pipe(string(), minLength(1, "Chybí popis služby")),
	content: pipe(string(), minLength(1, "Chybí obsah služby")),
});

export const ServiceCreateInput = object({
	...ServiceInput.entries,
	position: pipe(stringToNumber("Neplatná pozice"), minValue(1)),
	status: stringToBoolean("Neplatný status"),
	photo: imageSchema,
});

export const ServiceUpdateInput = object({
	id: uuidSchema("Chybí ID služby"),
	...ServiceCreateInput.entries,
	photo: optional(imageSchema),
});

export const ServiceCreateDTO = object({
	...ServiceInput.entries,
	position: pipe(number(), minValue(1)),
	status: boolean("Neplatný status"),
	photo: imageSchema,
});

export const ServiceUpdateDTO = object({
	id: uuidSchema("Chybí ID služby"),
	...ServiceCreateDTO.entries,
	photo: optional(imageSchema),
});

export const ServiceFindBySlugDTO = object({
	slug: pipe(string(), minLength(1, "Chybí název služby")),
});

export type ServiceCreateDTO = InferInput<typeof ServiceCreateDTO>;
export type ServiceUpdateDTO = InferInput<typeof ServiceUpdateDTO>;
