import {
	boolean,
	date,
	type InferInput,
	integer,
	maxLength,
	maxValue,
	minValue,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
	toBoolean,
	toDate,
	toNumber,
	transform,
	uuid,
} from "valibot";
import { dateSchema, priceSchema, uuidSchema } from "../common-schemas";

const billingDetailsInput = object({
	billingName: pipe(string(), maxLength(100, "Jméno může obsahovat maximálně 100 znaků")),
	billingCompany: pipe(string(), maxLength(100, " Firmy může obsahovat maximálně 100 znaků")),
	billingStreet: pipe(string(), maxLength(100, "Ulice může obsahovat maximálně 100 znaků")),
	billingZip: pipe(string(), maxLength(20, "PSČ může obsahovat maximálně 20 znaků")),
	billingCity: pipe(string(), maxLength(100, "Město může obsahovat maximálně 100 znaků")),
	billingCountry: pipe(string(), maxLength(100, "Země může obsahovat maximálně 100 znaků")),
	billingIc: pipe(string(), maxLength(20, "IČ může obsahovat maximálně 20 znaků")),
	billingDic: pipe(string(), maxLength(20, "DIČ může obsahovat maximálně 20 znaků")),
});

const PaymentInput = object({
	createdAt: pipe(dateSchema(), toDate()),
	dueAt: pipe(dateSchema(), toDate()),
	amount: pipe(priceSchema(), toNumber()),
	vat: pipe(
		string(),
		toNumber(),
		number(),
		minValue(0, "VAT musí být nezáporné číslo"),
		maxValue(100, "VAT musí být menší nebo rovno 100"),
	),
	paidAt: optional(
		pipe(
			string(),
			transform((v) => (v === "" ? undefined : v)),
			optional(dateSchema()),
			toDate(),
		),
	),
	referenceId: string(),
	description: pipe(string(), maxLength(255, "Popis může obsahovat maximálně 255 znaků")),
	paymentMethodId: uuidSchema(),
	isInvoice: pipe(picklist(["true", "false"]), toBoolean()),
	...billingDetailsInput.entries,
});

export const PaymentCreateInput = object({
	...PaymentInput.entries,
	paymentId: uuidSchema(),
	rideId: uuidSchema(),
});

export const PaymentUpdateInput = object({
	...PaymentInput.entries,
	isInvoice: boolean(),
});

export const PaymentCreateDTO = object({
	amount: pipe(number(), integer(), minValue(0)),
	vat: pipe(number(), integer(), minValue(0), maxValue(100)),
	createdAt: date(),
	dueAt: date(),
	paidAt: optional(date()),
	referenceId: string(),
	description: pipe(string(), maxLength(255)),
	paymentMethodId: pipe(string(), uuid()),
	isInvoice: boolean(),
	...billingDetailsInput.entries,
});

export const PaymentUpdateDTO = object({
	paymentId: pipe(string(), uuid()),
	...PaymentCreateDTO.entries,
});

export type PaymentCreateDTO = InferInput<typeof PaymentCreateDTO>;
export type PaymentUpdateDTO = InferInput<typeof PaymentUpdateDTO>;
