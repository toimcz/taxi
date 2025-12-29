import {
	array,
	boolean,
	enum_,
	type InferOutput,
	nullable,
	object,
	optional,
	string,
	union,
} from "valibot";
import { BillingDetail, Role } from "../common";
import { stringToDate } from "../common-schemas";

export const User = object({
	id: string(),
	name: string(),
	email: string(),
	firstName: string(),
	lastName: string(),
	emailVerified: boolean(),
	image: nullable(string()),
	phone: nullable(string()),
	roles: array(enum_(Role)),
	note: string(),
	createdAt: stringToDate("Neplatný formát datumu"),
	updatedAt: stringToDate("Neplatný formát datumu"),
	lastLoginAt: nullable(stringToDate("Neplatný formát datumu")),
	billingDetails: BillingDetail,
});

export type User = InferOutput<typeof User>;

export const UserItem = object({
	id: string(),
	name: string(),
	email: string(),
	phone: nullable(string()),
	note: string(),
	role: optional(union([string(), array(string())])),
	lastLoginAt: nullable(stringToDate("Neplatný formát datumu")),
});

export type UserItem = InferOutput<typeof UserItem>;
