import { ErrorResponse, PaginationParamsInput } from "@taxi/contracts/common";
import { PageFindBySlugInput } from "@taxi/contracts/pages/input";
import { PageFindBySlug } from "@taxi/contracts/pages/output";
import { db } from "@taxi/db";
import { pages$ } from "@taxi/db/schemas/pages";
import { and, asc, eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const pagesWebHandler = new Elysia({
	prefix: "pages",
	name: "pages-web",
})
	.get(
		"/top",
		({ query }) => {
			const limit = query?.limit ?? 9;
			const offset = query?.page ? (query.page - 1) * limit : 0;
			return db
				.select({
					id: pages$.id,
					slug: pages$.slug,
					title: pages$.title,
					description: pages$.description,
				})
				.from(pages$)
				.where(and(eq(pages$.top, true), eq(pages$.status, true)))
				.orderBy(asc(pages$.position))
				.limit(limit)
				.offset(offset);
		},
		{
			query: PaginationParamsInput,
		},
	)
	.get(
		"/bottom",
		async ({ query }) => {
			const limit = query?.limit ?? 9;
			const offset = query?.page ? (query.page - 1) * limit : 0;
			return await db
				.select({
					id: pages$.id,
					slug: pages$.slug,
					title: pages$.title,
					description: pages$.description,
				})
				.from(pages$)
				.where(and(eq(pages$.bottom, true), eq(pages$.status, true)))
				.orderBy(asc(pages$.position))
				.limit(limit)
				.offset(offset);
		},
		{
			query: PaginationParamsInput,
		},
	)
	.get(
		"/findBySlug/:slug",
		async ({ params, status }) => {
			const [page] = await db
				.select({
					id: pages$.id,
					slug: pages$.slug,
					title: pages$.title,
					description: pages$.description,
					content: pages$.content,
				})
				.from(pages$)
				.where(eq(pages$.slug, params.slug))
				.limit(1);
			if (!page) {
				throw status(404, { status: 404, message: "Page not found" });
			}
			return page;
		},
		{
			params: PageFindBySlugInput,
			response: {
				200: PageFindBySlug,
				404: ErrorResponse,
			},
		},
	);
