import { array, type InferOutput, object, string } from "valibot";

export const PageItem = object({
	id: string(),
	slug: string(),
	title: string(),
	description: string(),
});

export const Page = object({
	id: string(),
	slug: string(),
	title: string(),
	description: string(),
	content: string(),
});

export const PagesTop = array(PageItem);
export const PagesBottom = array(PageItem);
export const PageFindBySlug = Page;

export type PagesTop = InferOutput<typeof PagesTop>;
export type PagesBottom = InferOutput<typeof PagesBottom>;
export type PageFindBySlug = InferOutput<typeof PageFindBySlug>;
