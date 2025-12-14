import {
	array,
	boolean,
	date,
	enum_,
	type InferOutput,
	nullable,
	object,
	optional,
	string,
	union,
} from "valibot";
import { BillingDetail, PaginationMeta, Role } from "../common";

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
	createdAt: string(),
	updatedAt: string(),
	lastLoginAt: nullable(string()),
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
	lastLoginAt: nullable(date()),
});

export type UserItem = InferOutput<typeof UserItem>;

export const Users = object({
	users: array(UserItem),
	meta: PaginationMeta,
});

export type Users = InferOutput<typeof Users>;
