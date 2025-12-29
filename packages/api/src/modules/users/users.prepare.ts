import { db, users$ } from "@taxi/db";
import { count, eq, sql } from "drizzle-orm";

export const columns = {
	id: true,
	name: true,
	email: true,
	phone: true,
	roles: true,
	note: true,
	lastLoginAt: true,
} as const;

/**
 * Find all users
 */
export const getFindAllUsers = db.query.users$
	.findMany({
		columns,
	})
	.prepare("findAllUsers");

/**
 * Find all users paginated
 */
export const getFindAllUsersPaginated = db.query.users$
	.findMany({
		columns,
		limit: sql.placeholder("limit"),
		offset: sql.placeholder("offset"),
	})
	.prepare("findAllUsersPaginated");

/**
 * Find all users count
 */
export const getFindAllUsersCount = db
	.select({ count: count() })
	.from(users$)
	.prepare("findAllUsersCount");

/**
 * Find user by id
 */
export const getFindUserById = db.query.users$
	.findFirst({
		where: eq(users$.id, sql.placeholder("id")),
	})
	.prepare("findUserById");

/**
 * Find user by email
 */
export const getFindUserByEmail = db.query.users$
	.findFirst({
		where: eq(users$.email, sql.placeholder("email")),
	})
	.prepare("findUserByEmail");
