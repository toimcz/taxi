import { db } from "@taxi/db";
import { users$ } from "@taxi/db/schemas/auth";
import { count, eq, sql } from "drizzle-orm";

export const userItemSelect = {
	id: users$.id,
	name: users$.name,
	email: users$.email,
	phone: users$.phone,
	role: users$.roles,
	note: users$.note,
	lastLoginAt: users$.lastLoginAt,
} as const;

/**
 * Find all users
 */
export const findAllUsers = db
	.select(userItemSelect)
	.from(users$)
	.prepare("findAllUsers");

/**
 * Find all users paginated
 */
export const findAllUsersPaginated = db
	.select(userItemSelect)
	.from(users$)
	.limit(sql.placeholder("limit"))
	.offset(sql.placeholder("offset"))
	.prepare("findAllUsersPaginated");

/**
 * Find all users count
 */
export const findAllUsersCount = db
	.select({
		count: count(),
	})
	.from(users$)
	.prepare("findAllUsersCount");

/**
 * Find user by id
 */
export const findUserById = db
	.select()
	.from(users$)
	.where(eq(users$.id, sql.placeholder("id")))
	.prepare("findUserById");

/**
 * Find user by email
 */
export const findUserByEmail = db
	.select()
	.from(users$)
	.where(eq(users$.email, sql.placeholder("email")))
	.prepare("findUserByEmail");
