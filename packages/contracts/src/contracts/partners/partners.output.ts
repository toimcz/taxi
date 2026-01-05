import { array, boolean, type InferOutput, nullable, object, omit, string } from "valibot";
import { Driver } from "../drivers";

export const Partner = object({
	id: string(),
	name: string(),
	email: nullable(string()),
	phone: nullable(string()),
	status: boolean(),
	drivers: array(omit(Driver, ["partnerId", "partnerName"])),
});

export type Partner = InferOutput<typeof Partner>;

export const PartnerItem = object({
	id: string(),
	name: string(),
	email: nullable(string()),
	phone: nullable(string()),
	status: boolean(),
});

export type PartnerItem = InferOutput<typeof PartnerItem>;
