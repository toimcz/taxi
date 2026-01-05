import parsePhoneNumber from "libphonenumber-js";
import {
	custom,
	date,
	email,
	integer,
	minLength,
	number,
	picklist,
	pipe,
	regex,
	string,
	toDate,
	toLowerCase,
	toNumber,
	transform,
	trim,
	union,
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
	pipe(string(), email(message || "Neplatný formát emailu"), trim(), toLowerCase());

export const nameSchema = (message?: string) =>
	pipe(string(), minLength(1, message || "Jméno musí obsahovat alespoň jeden znak"));

export const dateSchema = (message?: string) =>
	pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/, message || "Neplatný formát datumu"));

export const timeSchema = (message?: string) =>
	pipe(string(), regex(/^\d{2}:\d{2}$/, message || "Neplatný formát času"));

export const priceSchema = (message?: string) =>
	pipe(number("Neplatný formát čísla"), integer(message || "Číslo musí být celé"));

export const phoneSchema = (message?: string) =>
	pipe(string(), custom(validatePhone, message || "Telefon je neplatný"));

export const stringToBoolean = (message?: string) =>
	pipe(
		picklist(["true", "false"], message || "Neplatný formát booleanu"),
		transform((v) => v === "true"),
	);

export const stringToNumber = (message?: string) =>
	pipe(string(), toNumber(message || "Neplatný formát čísla"));

export const stringToDate = (message?: string) =>
	pipe(
		union([string(message || "Neplatný formát datumu"), date(message || "Neplatný formát datumu")]),
		toDate(),
	);
