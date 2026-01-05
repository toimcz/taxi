import {
	email,
	forward,
	type InferOutput,
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
	email: emailSchema("Neplatný email"),
	password: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
});

export const LoginPasswordDTO = object({
	email: emailSchema("Neplatný email"),
	password: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
});

export type LoginPasswordDTO = InferOutput<typeof LoginPasswordDTO>;

export const LoginEmailInput = object({
	email: emailSchema("Neplatný email"),
	redirectUrl: pipe(string(), url("Neplatná URL")),
});

export const LoginEmailDTO = object({
	email: emailSchema("Neplatný email"),
	redirectUrl: pipe(string(), url("Neplatná URL")),
});

export type LoginEmailDTO = InferOutput<typeof LoginEmailDTO>;

export const LoginGoogleInput = object({
	redirectUrl: pipe(string(), url("Neplatná URL")),
});

export const LoginGoogleDTO = LoginGoogleInput;

export type LoginGoogleDTO = InferOutput<typeof LoginGoogleDTO>;

export const RegisterPasswordInput = pipe(
	object({
		firstName: nameSchema("Jméno je povinné"),
		lastName: nameSchema("Příjmení je povinné"),
		phone: optional(phoneSchema("Telefon je neplatný"), ""),
		email: emailSchema("Email je neplatný"),
		password: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
		passwordConfirm: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
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

export const RegisterPasswordDTO = pipe(
	object({
		firstName: pipe(string(), minLength(1, "Jméno je povinné")),
		lastName: pipe(string(), minLength(1, "Příjmení je povinné")),
		phone: optional(string(), ""),
		email: pipe(string(), email("Email je neplatný")),
		password: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
		passwordConfirm: pipe(string(), minLength(8, "Heslo musí obsahovat alespoň 8 znaků")),
	}),
);

export type RegisterPasswordDTO = InferOutput<typeof RegisterPasswordDTO>;

export const RegisterPasswordlessInput = object({
	firstName: nameSchema("Jméno je povinné"),
	lastName: nameSchema("Příjmení je povinné"),
	phone: optional(phoneSchema("Telefon je neplatný"), ""),
	email: emailSchema("Email je neplatný"),
	redirectUrl: pipe(string(), url("Neplatná URL")),
});

export const RegisterPasswordlessDTO = object({
	firstName: pipe(string(), minLength(1, "Jméno je povinné")),
	lastName: pipe(string(), minLength(1, "Příjmení je povinné")),
	phone: optional(string(), ""),
	email: pipe(string(), email("Email je neplatný")),
	redirectUrl: pipe(string(), url("Neplatná URL")),
});

export type RegisterPasswordlessDTO = InferOutput<typeof RegisterPasswordlessDTO>;

export const GoogleCallbackInput = object({
	redirectUrl: pipe(string(), url("Neplatná URL")),
	code: string(),
	state: string(),
});

export const GoogleCallbackDTO = GoogleCallbackInput;

export type GoogleCallbackDTO = InferOutput<typeof GoogleCallbackDTO>;

export const SessionIdInput = object({
	sessionId: string(),
});

export const SessionIdDTO = SessionIdInput;

export type SessionIdDTO = InferOutput<typeof SessionIdDTO>;

export const ValidateMagicLinkInput = object({
	token: string(),
});

export const ValidateMagicLinkDTO = ValidateMagicLinkInput;

export type ValidateMagicLinkDTO = InferOutput<typeof ValidateMagicLinkDTO>;
