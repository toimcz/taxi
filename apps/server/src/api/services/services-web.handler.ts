import { NotFoundResponse } from "@taxi/contracts/common";
import { ServiceFindBySlugInput } from "@taxi/contracts/services/input";
import { Service, ServiceFindBySlug } from "@taxi/contracts/services/output";
import { db } from "@taxi/db";
import { services$ } from "@taxi/db/schemas/services";
import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { array } from "valibot";

export const servicesWebHandler = new Elysia({
	prefix: "services",
	name: "services-web",
})
	.get(
		"/allActive",
		async () => {
			return await db
				.select({
					id: services$.id,
					title: services$.title,
					slug: services$.slug,
					photo: services$.photo,
					description: services$.description,
					content: services$.content,
				})
				.from(services$)
				.where(eq(services$.status, true));
		},
		{
			response: {
				200: array(Service),
			},
		},
	)
	.get(
		"/findBySlug/:slug",
		async ({ params, status }) => {
			const [service] = await db
				.select({
					id: services$.id,
					title: services$.title,
					slug: services$.slug,
					photo: services$.photo,
					description: services$.description,
					content: services$.content,
				})
				.from(services$)
				.where(eq(services$.slug, params.slug))
				.limit(1);
			if (!service) {
				throw status(404, { status: 404, message: "Service not found" });
			}
			return service;
		},
		{
			params: ServiceFindBySlugInput,
			response: {
				200: ServiceFindBySlug,
				404: NotFoundResponse,
			},
		},
	);
