import { ORPCError } from "@orpc/contract";
import type { PaginationParamsDTO, UserCreateDTO, UserUpdateDTO } from "@taxi/contracts";
import { type ApiData, type BillingDetail, Role, type User, type UserItem } from "@taxi/contracts";
import { db, type UserSelect, users$ } from "@taxi/db";
import { count, eq } from "drizzle-orm";
import type { GoogleUserInfo } from "../../lib/google";
import { getFindUserByEmail, getFindUserById } from "./users.prepare";
import { usersSearch } from "./users-search";

async function create(input: UserCreateDTO): Promise<User> {
	const { name, company, street, city, country, zip, ic, dic, ...user } = input;
	const billingDetails = {
		name,
		company,
		street,
		city,
		zip,
		country,
		ic,
		dic,
	} satisfies BillingDetail;
	const [newUser] = await db
		.insert(users$)
		.values({
			...user,
			name: `${input.lastName} ${input.firstName}`,
			billingDetails,
		})
		.returning();
	if (!newUser) {
		throw new Error("Failed to create user");
	}
	return mapToUser(newUser);
}

async function createFromGoogleUser(googleUser: GoogleUserInfo): Promise<User> {
	const name = `${googleUser.family_name} ${googleUser.given_name}`;
	return await create({
		email: googleUser.email,
		firstName: googleUser.given_name,
		lastName: googleUser.family_name,
		role: Role.USER,
		phone: "",
		note: "",
		name,
		company: "",
		street: "",
		city: "",
		zip: "",
		country: "",
		ic: "",
		dic: "",
	});
}
async function update(id: string, input: UserUpdateDTO): Promise<User> {
	const { name, company, street, city, country, zip, ic, dic, ...user } = input;
	const billingDetails = {
		name,
		company,
		street,
		city,
		zip,
		country,
		ic,
		dic,
	} satisfies BillingDetail;
	const [updatedUser] = await db
		.update(users$)
		.set({
			...user,
			name: `${input.lastName} ${input.firstName}`,
			billingDetails,
		})
		.where(eq(users$.id, id))
		.returning();
	if (!updatedUser) {
		throw new ORPCError("NOT_FOUND", {
			message: "User not found",
		});
	}
	return mapToUser(updatedUser);
}

async function findByEmail(email: string): Promise<User | undefined> {
	const user = await getFindUserByEmail.execute({ email });
	return user ? mapToUser(user) : undefined;
}

async function findById(id: string): Promise<User | undefined> {
	const user = await getFindUserById.execute({ id });
	return user;
}

async function updateLastLoginAt(id: string): Promise<void> {
	await db.update(users$).set({ lastLoginAt: new Date() }).where(eq(users$.id, id));
}

async function findByIdAndUpdateLastLoginAt(id: string): Promise<User | undefined> {
	await db.update(users$).set({ lastLoginAt: new Date() }).where(eq(users$.id, id));
	const user = await getFindUserById.execute({ id });
	return user ? mapToUser(user) : undefined;
}

async function search(query: string): Promise<ApiData<UserItem[]>> {
	const users = await usersSearch.search(query);
	return { data: users };
}

async function findAll(query: PaginationParamsDTO): Promise<ApiData<UserItem[]>> {
	const page = query.page ?? 1;
	const limit = query.limit ?? 10;
	const offset = page ? (page - 1) * limit : 0;
	const [totalResult, users] = await db.batch([
		db
			.select({
				count: count(),
			})
			.from(users$),
		db.query.users$.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				phone: true,
				roles: true,
				note: true,
				lastLoginAt: true,
			},
			limit,
			offset,
		}),
	]);
	const total = Number(totalResult[0]?.count);
	const totalPages = Math.ceil(total / limit);
	return {
		data: users,
		meta: {
			total,
			totalPages,
			page,
			limit,
		},
	};
}

function mapToUser(user: UserSelect): User {
	return user;
}

export const usersUseCases = {
	create,
	createFromGoogleUser,
	update,
	updateLastLoginAt,
	findByIdAndUpdateLastLoginAt,
	findByEmail,
	findById,
	findAll,
	search,
};
