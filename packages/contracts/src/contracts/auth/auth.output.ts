import { boolean, type InferOutput, object, string } from "valibot";
import { stringToDate } from "../common-schemas";

export const CookieOutput = object({
	name: string(),
	value: string(),
	expires: stringToDate(),
	secure: boolean(),
	httpOnly: boolean(),
	sameSite: string(),
	path: string(),
});

export type CookieOutput = InferOutput<typeof CookieOutput>;

export const SuccessOutput = object({
	message: string(),
});

export type SuccessOutput = InferOutput<typeof SuccessOutput>;

export const SuccessOutputWithCookies = object({
	message: string(),
	cookie: CookieOutput,
});

export type SuccessOutputWithCookies = InferOutput<typeof SuccessOutputWithCookies>;

export const GoogleLoginOutput = object({
	state: string(),
	url: string(),
});

export type GoogleLoginOutput = InferOutput<typeof GoogleLoginOutput>;

export const GoogleCallbackOutput = object({
	message: string(),
	cookie: CookieOutput,
});

export type GoogleCallbackOutput = InferOutput<typeof GoogleCallbackOutput>;
