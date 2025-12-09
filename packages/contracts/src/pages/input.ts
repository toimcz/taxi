import { type InferInput, object, string } from "valibot";

export const PageFindBySlugInput = object({
	slug: string(),
});

export type PageFindBySlugInput = InferInput<typeof PageFindBySlugInput>;
