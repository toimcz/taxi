import { enum_, type InferOutput, nullable, object, string } from "valibot";
import { DateFormat, EmailStatus } from "../common";

export const Email = object({
	id: string(),
	providerId: string(),
	email: string(),
	subject: string(),
	status: enum_(EmailStatus),
	createdById: nullable(string()),
	createdAt: DateFormat,
});
export type Email = InferOutput<typeof Email>;
