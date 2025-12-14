import {
	forward,
	type InferInput,
	minLength,
	object,
	optional,
	partialCheck,
	pipe,
	string,
	url,
} from "valibot";
import { emailSchema, nameSchema, phoneSchema } from "../common-schemas";

export const LoginPasswordInput = object({
	email: emailSchema("Email je neplatný"),
	password: pipe(
		string(),
		minLength(8, "Heslo musí obsahovat alespoň 8 znaků"),
	),
});

export type LoginPasswordInput = InferInput<typeof LoginPasswordInput>;

export const LoginEmailInput = object({
	email: emailSchema("Email je neplatný"),
	redirectUrl: pipe(string(), url()),
});

export type LoginEmailInput = InferInput<typeof LoginEmailInput>;

export const MagicLinkInput = object({
	token: string(),
});

export type MagicLinkInput = InferInput<typeof MagicLinkInput>;

export const GoogleLoginInput = object({
	redirectUrl: string(),
});

export type GoogleLoginInput = InferInput<typeof GoogleLoginInput>;

export const GoogleCallbackInput = object({
	code: string(),
	state: string(),
});

export type GoogleCallbackInput = InferInput<typeof GoogleCallbackInput>;

export const RegisterPasswordInput = pipe(
	object({
		firstName: nameSchema("Jméno je povinné"),
		lastName: nameSchema("Příjmení je povinné"),
		phone: optional(phoneSchema("Telefon je neplatný"), ""),
		email: emailSchema("Email je neplatný"),
		password: pipe(
			string(),
			minLength(8, "Heslo musí obsahovat alespoň 8 znaků"),
		),
		passwordConfirm: pipe(
			string(),
			minLength(8, "Heslo musí obsahovat alespoň 8 znaků"),
		),
	}),
	forward(
		partialCheck(
			[["password"], ["passwordConfirm"]],
			({ password, passwordConfirm }) => password === passwordConfirm,
			"Hesla se neshodují",
		),
		["passwordConfirm"],
	),
);

export type RegisterPasswordInput = InferInput<typeof RegisterPasswordInput>;

export const RegisterPasswordlessInput = object({
	email: emailSchema("Email je neplatný"),
	firstName: nameSchema("Jméno je povinné"),
	lastName: nameSchema("Příjmení je povinné"),
	phone: optional(phoneSchema("Telefon je neplatný"), ""),
	redirectUrl: pipe(string(), url()),
});

export type RegisterPasswordlessInput = InferInput<
	typeof RegisterPasswordlessInput
>;
