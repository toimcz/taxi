import {
	boolean,
	type InferInput,
	minLength,
	object,
	optional,
	pipe,
	string,
	transform,
	uuid,
} from "valibot";
import { emailSchema, stringToBoolean } from "../common-schemas";

export const PartnerCreateInput = object({
	name: pipe(string(), minLength(2, "Název musí mít alespoň 2 znaky")),
	email: optional(
		pipe(
			string(),
			transform((v) => (v === "" ? undefined : v)),
			optional(emailSchema()),
		),
	),
	phone: optional(
		pipe(
			string(),
			transform((v) => (v === "" ? undefined : v)),
			optional(pipe(string(), minLength(9, "Telefonní číslo musí mít alespoň 9 znaků"))),
		),
	),

	status: optional(stringToBoolean(), "true"),
});

export const PartnerUpdateInput = object({
	...PartnerCreateInput.entries,
	status: stringToBoolean(),
});

export const PartnerCreateDTO = object({
	...PartnerCreateInput.entries,
	status: boolean(),
});
export const PartnerUpdateDTO = object({
	...PartnerCreateInput.entries,
	id: pipe(string(), uuid()),
	status: boolean(),
});

export type PartnerCreateDTO = InferInput<typeof PartnerCreateDTO>;
export type PartnerUpdateDTO = InferInput<typeof PartnerUpdateDTO>;
