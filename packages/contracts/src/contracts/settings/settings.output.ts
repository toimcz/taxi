import { boolean, type InferOutput, object, string } from "valibot";
import { stringToDate, uuidSchema } from "../common-schemas";

export const Setting = object({
	id: uuidSchema(),
	key: string(),
	description: string(),
	value: string(),
	devValue: string(),
	editable: boolean(),
	createdAt: stringToDate(),
	updatedAt: stringToDate(),
});

export type Setting = InferOutput<typeof Setting>;
