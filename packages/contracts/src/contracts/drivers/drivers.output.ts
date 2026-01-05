import { boolean, type InferOutput, object, pipe, string, uuid } from "valibot";

export const Driver = object({
	id: pipe(string(), uuid()),
	firstName: string(),
	lastName: string(),
	fullName: string(),
	email: string(),
	phone: string(),
	status: boolean(),
	partnerId: pipe(string(), uuid()),
	partnerName: string(),
});

export type Driver = InferOutput<typeof Driver>;

export const DriverItem = object({
	id: pipe(string(), uuid()),
	fullName: string(),
	partnerName: string(),
});

export type DriverItem = InferOutput<typeof DriverItem>;
