import {
	array,
	boolean,
	type InferOutput,
	minLength,
	minValue,
	nullable,
	number,
	object,
	pipe,
	string,
	uuid,
} from "valibot";
import { CarBase } from "../cars/cars.output";

export const BaseItem = object({
	id: pipe(string(), uuid()),
	city: pipe(string(), minLength(1)),
	country: pipe(string(), minLength(1)),
	placeId: nullable(string()),
	koeficient: pipe(number(), minValue(1)),
	strength: pipe(number(), minValue(0)),
	lat: number(),
	lng: number(),
	status: boolean(),
});
export type BaseItem = InferOutput<typeof BaseItem>;

export const Base = object({
	id: pipe(string(), uuid()),
	city: pipe(string(), minLength(1)),
	country: pipe(string(), minLength(1)),
	placeId: nullable(string()),
	koeficient: pipe(number(), minValue(1)),
	strength: pipe(number(), minValue(0)),
	status: boolean(),
	lat: number(),
	lng: number(),
});

export const BaseWithCars = object({
	...Base.entries,
	cars: array(CarBase),
});

export type Base = InferOutput<typeof Base>;
export type BaseWithCars = InferOutput<typeof BaseWithCars>;
