import { type InferInput, object, string } from "valibot";

export const ServiceFindBySlugInput = object({
	slug: string(),
});

export type ServiceFindBySlugInput = InferInput<typeof ServiceFindBySlugInput>;
