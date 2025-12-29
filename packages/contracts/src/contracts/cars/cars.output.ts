import { boolean, type InferOutput, number, object, omit, pipe, string, uuid } from "valibot";

export const Car = object({
	id: pipe(string(), uuid()),
	name: string(),
	baseCity: string(),
	status: boolean(),
	description: string(),
	adminName: string(),
	photo: string(),
	priceKm: number(),
	minPrice: number(),
	basePrice: number(),
	perPerson: boolean(),
	pax: number(),
	luggage: number(),
	types: string(),
	deposit: boolean(),
	surge: boolean(),
	baseId: pipe(string(), uuid()),
	tags: string(),
});

export type Car = InferOutput<typeof Car>;

export const CarBase = omit(Car, ["baseId", "baseCity"]);

export type CarBase = InferOutput<typeof CarBase>;

export const CarWithPrice = object({
	...CarBase.entries,
	price: number(),
	koeficient: number(),
});

export type CarWithPrice = InferOutput<typeof CarWithPrice>;
