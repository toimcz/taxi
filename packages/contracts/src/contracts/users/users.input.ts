import {
	email,
	enum_,
	type InferOutput,
	minLength,
	object,
	optional,
	partial,
	pipe,
	string,
	uuid,
} from "valibot";
import { BillingDetail, Role } from "../common";
import { emailSchema, nameSchema, phoneSchema } from "../common-schemas";

export const UserFindByEmailInput = object({
	email: pipe(string(), emailSchema("Email je neplatný")),
});

export const UserFindByEmailDTO = UserFindByEmailInput;

export type UserFindByEmailDTO = InferOutput<typeof UserFindByEmailDTO>;

export const UsersSearchInput = object({
	query: string(),
});

export const UsersSearchDTO = UsersSearchInput;

export type UsersSearchDTO = InferOutput<typeof UsersSearchDTO>;

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

export const UserCreateDTO = object({
	firstName: pipe(string(), minLength(2, "Jméno musí mít alespoň 2 znaky")),
	lastName: pipe(string(), minLength(2, "Příjmení musí mít alespoň 2 znaky")),
	phone: optional(string("Telefon je neplatný"), ""),
	email: pipe(string(), email("Email je neplatný")),
	role: optional(enum_(Role), "user"),
	note: optional(string(), ""),
	...BillingDetail.entries,
});

export type UserCreateDTO = InferOutput<typeof UserCreateDTO>;
export type UserUpdateDTO = InferOutput<typeof UserUpdateDTO>;

export const UserPartialUpdateInput = object({
	...partial(
		object({
			...UserCreateInput.entries,
		}),
	).entries,
	id: pipe(string(), uuid()),
});

export const UserUpdateDTO = object({
	...UserCreateDTO.entries,
	id: pipe(string(), uuid()),
});

export const UserPartialUpdateDTO = object({
	...partial(
		object({
			...UserCreateDTO.entries,
		}),
	).entries,
	id: pipe(string(), uuid()),
});

export type UserPartialUpdateDTO = InferOutput<typeof UserPartialUpdateDTO>;
