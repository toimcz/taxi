import {
	enum_,
	type InferInput,
	object,
	optional,
	pipe,
	string,
	uuid,
} from "valibot";
import { BillingDetail, Role } from "../common";
import { emailSchema, nameSchema, phoneSchema } from "../common-schemas";

export const UserCreateInput = object({
	firstName: nameSchema("Jméno je povinné"),
	lastName: nameSchema("Příjmení je povinné"),
	phone: optional(phoneSchema("Telefon je neplatný"), ""),
	email: emailSchema("Email je povinný"),
	role: optional(enum_(Role), "user"),
	note: optional(string(), ""),
	...BillingDetail.entries,
});

export const UserUpdateInput = UserCreateInput;

export const UserSearchInput = object({
	query: string(),
});

export const UserBanInput = object({
	id: pipe(string(), uuid()),
	banReason: string(),
});

export type UserCreateInput = InferInput<typeof UserCreateInput>;
export type UserUpdateInput = InferInput<typeof UserUpdateInput>;
export type UserSearchInput = InferInput<typeof UserSearchInput>;
export type UserBanInput = InferInput<typeof UserBanInput>;
