import {
	boolean,
	enum_,
	type InferInput,
	maxLength,
	minLength,
	object,
	optional,
	pipe,
	string,
	uuid,
} from "valibot";
import { PaymentMethodProvider } from "../common";
import { stringToBoolean } from "../common-schemas";

export const PaymentMethodInput = object({
	name: pipe(
		string(),
		minLength(2, "Název musí mít alespoň 2 znaky"),
		maxLength(160, "Název může mít maximálně 160 znaků"),
	),
	adminName: pipe(
		string(),
		minLength(2, "Admin název musí mít alespoň 2 znaky"),
		maxLength(160, "Admin název může mít maximálně 160 znaků"),
	),
	description: pipe(
		string(),
		minLength(2, "Popis musí mít alespoň 2 znaky"),
		maxLength(160, "Popis může mít maximálně 160 znaků"),
	),
	provider: enum_(PaymentMethodProvider),
});

export const PaymentMethodCreateInput = object({
	...PaymentMethodInput.entries,
	public: stringToBoolean(),
	status: stringToBoolean(),
});
export const PaymentMethodUpdateInput = PaymentMethodCreateInput;

export const PaymentMethodCreateDTO = object({
	...PaymentMethodInput.entries,
	public: optional(boolean(), true),
	status: optional(boolean(), true),
});

export const PaymentMethodUpdateDTO = object({
	id: pipe(string(), uuid()),
	...PaymentMethodCreateDTO.entries,
});

export type PaymentMethodUpdateDTO = InferInput<typeof PaymentMethodUpdateDTO>;
export type PaymentMethodCreateDTO = InferInput<typeof PaymentMethodCreateDTO>;
