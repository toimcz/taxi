import { boolean, type InferInput, minLength, object, optional, pipe, string, uuid } from "valibot";
import { emailSchema, nameSchema, stringToBoolean, uuidSchema } from "../common-schemas";

const DriverInput = object({
	firstName: nameSchema("Jméno je povinné"),
	lastName: nameSchema("Příjmení je povinné"),
	email: emailSchema("Email není platný"),
	phone: pipe(string(), minLength(9, "Telefon musí mít minimálně 9 číslic")),
});

export const DriverCreateInput = object({
	...DriverInput.entries,
	status: stringToBoolean(),
});

export const DriverUpdateInput = DriverCreateInput;

export const DriverCreateDTO = object({
	...DriverInput.entries,
	partnerId: pipe(string(), uuid()),
	status: optional(boolean(), true),
});

export const DriverUpdateDTO = object({
	...DriverCreateDTO.entries,
	id: uuidSchema(),
});

export type DriverCreateDTO = InferInput<typeof DriverCreateDTO>;
export type DriverUpdateDTO = InferInput<typeof DriverUpdateDTO>;
