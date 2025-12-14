import {
	NotFoundResponse,
	PaginationParamsInput,
	ParamUUID,
} from "@taxi/contracts/common";
import {
	UserSearchInput,
	UserUpdateInput,
} from "@taxi/contracts/users/users.input";
import { User, UserItem, Users } from "@taxi/contracts/users/users.output";
import { db } from "@taxi/db";
import { users$ } from "@taxi/db/schemas/auth";
import { count, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { sessionsMiddleware } from "src/api/sessions/sessions.middleware";
import {
	findAllUsersPaginated,
	findUserById,
} from "src/api/users/users.prepare";
import { UsersSearchService } from "src/api/users/users-search.service";
import { array } from "valibot";

export const usersAdminHandler = new Elysia({
	prefix: "/users",
	name: "users-admin",
})
	.decorate("usersSearch", UsersSearchService.instance)
	.use(sessionsMiddleware)
	.get(
		"/",
		async (ctx) => {
			const page = Number(ctx.query.page ?? 1);
			const limit = Number(ctx.query.limit ?? 10);
			const offset = page ? (page - 1) * limit : 0;
			const total =
				(await db.select({ count: count() }).from(users$))[0]?.count ?? 0;
			const totalPages = Math.ceil(total / limit);
			const usersData = await findAllUsersPaginated.execute({ limit, offset });
			return {
				users: usersData,
				meta: {
					total,
					page,
					limit,
					totalPages,
				},
			};
		},
		{
			query: PaginationParamsInput,
			response: {
				200: Users,
			},
		},
	)
	.get(
		"/search",
		async ({ query, usersSearch }) => {
			return await usersSearch.search(query.query);
		},
		{
			query: UserSearchInput,
			response: {
				200: array(UserItem),
			},
		},
	)
	.get(
		"/findById/:id",
		async ({ params, status }) => {
			const { id } = params;
			const [user] = await findUserById.execute({ id });
			if (!user) {
				throw status(404, { status: 404, message: "User not found" });
			}
			return user;
		},
		{
			params: ParamUUID,
			response: {
				200: User,
				404: NotFoundResponse,
			},
		},
	)
	.patch(
		"/:id",
		async ({ params, body, status }) => {
			console.log(body);
			const { id } = params;
			const [user] = await db
				.update(users$)
				.set({
					firstName: body.firstName,
					lastName: body.lastName,
					name: `${body.firstName} ${body.lastName}`,
					email: body.email,
					phone: body.phone,
					note: body.note,
					roles: [body.role],
					billingDetails: {
						name: body.name,
						company: body.company,
						street: body.street,
						city: body.city,
						zip: body.zip,
						country: body.country,
						ic: body.ic,
						dic: body.dic,
					},
				})
				.where(eq(users$.id, id))
				.returning();
			if (!user) {
				throw status(404, { status: 404, message: "User not found" });
			}
			return user;
		},
		{
			params: ParamUUID,
			body: UserUpdateInput,
			response: {
				200: User,
				404: NotFoundResponse,
			},
		},
	);
