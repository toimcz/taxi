import { boolean, type InferOutput, number, object, pipe, string, uuid } from "valibot";

export const Country = object({
	id: pipe(string(), uuid()),
	name: string(),
	koeficient: number(),
	from: boolean(),
	to: boolean(),
	in: boolean(),
	status: boolean(),
});

export type Country = InferOutput<typeof Country>;
