import type { User } from "@taxi/contracts/users/users.output";
import { type Database, db } from "@taxi/db";
import {
	type UserInsert,
	type UserSelect,
	users$,
} from "@taxi/db/schemas/auth";
import { eq } from "drizzle-orm";
import type { GoogleUserInfo } from "src/api/auth/google-auth.service";
import { findUserByEmail, findUserById } from "src/api/users/users.prepare";

export class UsersService {
	static #instance: UsersService;
	private readonly db: Database;

	private constructor(db: Database) {
		this.db = db;
	}

	static get instance(): UsersService {
		if (!UsersService.#instance) {
			UsersService.#instance = new UsersService(db);
		}
		return UsersService.#instance;
	}

	async create(user: UserInsert): Promise<User> {
		const [newUser] = await this.db.insert(users$).values(user).returning();
		if (!newUser) {
			throw new Error("Failed to create user");
		}
		return this.mapToUser(newUser);
	}

	async createFromGoogleUser(googleUser: GoogleUserInfo): Promise<User> {
		return await this.create({
			email: googleUser.email,
			name: googleUser.name,
			firstName: googleUser.given_name,
			lastName: googleUser.family_name,
			billingDetails: {
				name: googleUser.name,
				company: "",
				street: "",
				city: "",
				zip: "",
				country: "",
				ic: "",
				dic: "",
			},
		});
	}

	async update(id: string, user: Partial<UserInsert>): Promise<User> {
		const [updatedUser] = await this.db
			.update(users$)
			.set(user)
			.where(eq(users$.id, id))
			.returning();
		if (!updatedUser) {
			throw new Error("Failed to update user");
		}
		return this.mapToUser(updatedUser);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const [user] = await findUserByEmail.execute({ email });
		return user ? this.mapToUser(user) : undefined;
	}

	async findById(id: string): Promise<User | undefined> {
		const [user] = await findUserById.execute({ id });
		return user ? this.mapToUser(user) : undefined;
	}

	private mapToUser(user: UserSelect): User {
		return {
			...user,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
			lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
		};
	}
}
