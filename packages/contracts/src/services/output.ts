import { type InferOutput, object, string } from "valibot";

export const Service = object({
	id: string(),
	title: string(),
	slug: string(),
	photo: string(),
	description: string(),
	content: string(),
});

export type Service = InferOutput<typeof Service>;

export const ServiceFindBySlug = Service;
export type ServiceFindBySlug = InferOutput<typeof ServiceFindBySlug>;
