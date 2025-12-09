import { PaginationParamsInput } from "@taxi/contracts/common";
import { db } from "@taxi/db";
import { routes$ } from "@taxi/db/schemas/routes";
import { eq } from "drizzle-orm";
import Elysia from "elysia";

export const routesWebHandler = new Elysia({
	prefix: "routes",
	name: "routes-web",
}).get(
	"/allActive",
	async ({ query }) => {
		const limit = query?.limit ?? 9;
		const offset = query?.page ? (query.page - 1) * limit : 0;
		return await db
			.select({
				id: routes$.id,
				title: routes$.title,
				distance: routes$.distance,
				duration: routes$.duration,
				url: routes$.url,
			})
			.from(routes$)
			.where(eq(routes$.status, true))
			.limit(limit)
			.offset(offset);
	},
	{
		query: PaginationParamsInput,
	},
);
