import parsePhoneNumber from "libphonenumber-js";
import {
	custom,
	email,
	type InferInput,
	integer,
	minLength,
	number,
	object,
	optional,
	pipe,
	regex,
	string,
	toLowerCase,
	trim,
	uuid,
} from "valibot";

export const validatePhone = (val: unknown): boolean => {
	try {
		if (val === undefined || val === null || val === "") return true;
		if (typeof val === "string" || typeof val === "number") {
			return !!parsePhoneNumber(String(val))?.isValid();
		}
		return false;
	} catch {
		return false;
	}
};

export const uuidSchema = (message?: string) => pipe(string(), uuid(message));

export const emailSchema = (message?: string) =>
	pipe(
		string(),
		email(message || "Neplatný formát emailu"),
		trim(),
		toLowerCase(),
	);

export const nameSchema = (message?: string) =>
	pipe(
		string(),
		minLength(1, message || "Jméno musí obsahovat alespoň jeden znak"),
	);

export const dateSchema = (message?: string) =>
	pipe(
		string(),
		regex(/^\d{4}-\d{2}-\d{2}$/, message || "Neplatný formát datumu"),
	);

export const timeSchema = (message?: string) =>
	pipe(string(), regex(/^\d{2}:\d{2}$/, message || "Neplatný formát času"));

export const priceSchema = (message?: string) =>
	pipe(
		number("Neplatný formát čísla"),
		integer(message || "Číslo musí být celé"),
	);

export const phoneSchema = (message?: string) =>
	pipe(string(), custom(validatePhone, message || "Telefon je neplatný"));

export const ParseId = object({
	id: pipe(string(), uuid()),
});

export type ParseId = InferInput<typeof ParseId>;

export const PaginationParamsInput = object({
	page: optional(number()),
	limit: optional(number()),
});

export type PaginationParamsInput = InferInput<typeof PaginationParamsInput>;
