import { ORPCError } from "@orpc/contract";
import type { Page, PageCreateDTO, PageItem, PageUpdateDTO } from "@taxi/contracts";
import { db, pages$ } from "@taxi/db";
import { and, asc, eq } from "drizzle-orm";
import { text } from "../../lib/text";

const select = {
	id: pages$.id,
	slug: pages$.slug,
	title: pages$.title,
	description: pages$.description,
	position: pages$.position,
	top: pages$.top,
	bottom: pages$.bottom,
	status: pages$.status,
	createdAt: pages$.createdAt,
	updatedAt: pages$.updatedAt,
} as const;

const findAll = async (): Promise<PageItem[]> => {
	return await db.select(select).from(pages$).orderBy(asc(pages$.position));
};

const findAllPublic = async (): Promise<PageItem[]> => {
	return await db
		.select(select)
		.from(pages$)
		.where(eq(pages$.status, true))
		.orderBy(asc(pages$.position));
};

const findTop = async (): Promise<PageItem[]> => {
	return await db
		.select(select)
		.from(pages$)
		.where(and(eq(pages$.top, true), eq(pages$.status, true)))
		.orderBy(asc(pages$.position));
};

const findBottom = async (): Promise<PageItem[]> => {
	return await db
		.select(select)
		.from(pages$)
		.where(and(eq(pages$.bottom, true), eq(pages$.status, true)))
		.orderBy(asc(pages$.position));
};

const findById = async (id: string): Promise<Page | undefined> => {
	return await db.query.pages$.findFirst({
		where: eq(pages$.id, id),
	});
};

const findBySlug = async (slug: string): Promise<Page | undefined> => {
	return await db.query.pages$.findFirst({
		where: and(eq(pages$.slug, slug), eq(pages$.status, true)),
	});
};

const create = async (input: PageCreateDTO): Promise<Page> => {
	const [page] = await db
		.insert(pages$)
		.values({
			...input,
			slug: text.slug(input.title),
		})
		.returning();
	if (!page) throw new ORPCError("NOT_FOUND", { message: "Page not found" });
	return page;
};

const update = async (input: PageUpdateDTO): Promise<Page> => {
	const [page] = await db
		.update(pages$)
		.set({
			...input,
			slug: text.slug(input.title),
		})
		.where(eq(pages$.id, input.id))
		.returning();
	if (!page) throw new ORPCError("NOT_FOUND", { message: "Page not found" });
	return page;
};

const deletePage = async (id: string): Promise<Page> => {
	const [page] = await db.delete(pages$).where(eq(pages$.id, id)).returning();
	if (!page) throw new ORPCError("NOT_FOUND", { message: "Page not found" });
	return page;
};

export const pagesUseCases = {
	findAll,
	findAllPublic,
	findTop,
	findBottom,
	findById,
	findBySlug,
	create,
	update,
	delete: deletePage,
};
