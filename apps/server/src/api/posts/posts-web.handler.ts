import { PaginationParamsInput } from "@taxi/contracts/common";
import { db } from "@taxi/db";
import { postCategories$ } from "@taxi/db/schemas/post-categories";
import { posts$ } from "@taxi/db/schemas/posts";
import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import Elysia from "elysia";

export const postsWebHandler = new Elysia({
	prefix: "posts",
	name: "posts-web",
}).get(
	"/allPublished",
	async ({ query }) => {
		const limit = query?.limit ?? 9;
		const offset = query?.page ? (query.page - 1) * limit : 0;
		return await db
			.select({
				id: posts$.id,
				title: posts$.title,
				description: posts$.description,
				slug: posts$.slug,
				photo: posts$.photo,
				categorySlug: postCategories$.slug,
			})
			.from(posts$)
			.innerJoin(postCategories$, eq(posts$.categoryId, postCategories$.id))
			.where(
				and(
					eq(posts$.public, true),
					lte(posts$.publishAt, new Date()),
					or(gte(posts$.expiresAt, new Date()), isNull(posts$.expiresAt)),
					eq(postCategories$.status, true),
				),
			)
			.orderBy(desc(posts$.publishAt))
			.limit(limit)
			.offset(offset);
	},
	{
		query: PaginationParamsInput,
	},
);
