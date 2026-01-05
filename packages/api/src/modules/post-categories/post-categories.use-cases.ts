import { ORPCError } from "@orpc/contract";
import type {
	PostCategory,
	PostCategoryCreateDTO,
	PostCategoryUpdateDTO,
	PostCategoryWithPosts,
} from "@taxi/contracts";
import { db, postCategories$, posts$ } from "@taxi/db";
import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { text } from "../../lib/text";

const findAll = async (): Promise<PostCategory[]> => {
	return db.query.postCategories$.findMany();
};

const findAllPublic = async (): Promise<PostCategory[]> => {
	return db.query.postCategories$.findMany({
		where: eq(postCategories$.status, true),
	});
};

const findById = async (id: string): Promise<PostCategory | undefined> => {
	return db.query.postCategories$.findFirst({ where: eq(postCategories$.id, id) });
};

const findBySlug = async (slug: string): Promise<PostCategoryWithPosts | undefined> => {
	const now = new Date();
	const category = await db.query.postCategories$.findFirst({
		with: {
			posts: {
				where: and(
					eq(posts$.public, true),
					lte(posts$.publishAt, now),
					or(isNull(posts$.expiresAt), gte(posts$.expiresAt, now)),
				),
				orderBy: [desc(posts$.createdAt)],
			},
		},
		where: and(eq(postCategories$.slug, slug), eq(postCategories$.status, true)),
	});
	if (!category) return undefined;
	const { posts, ...rest } = category;
	return {
		...rest,
		posts: posts.map((post) => ({
			...post,
			url: `/${category.slug}/${post.slug}`,
		})),
	};
};

const create = async (input: PostCategoryCreateDTO): Promise<PostCategory> => {
	const checkExisting = await db.query.postCategories$.findFirst({
		where: eq(postCategories$.name, input.name),
	});
	if (checkExisting) {
		throw new ORPCError("CONFLICT", { message: "Post category with this name already exists" });
	}
	const [category] = await db
		.insert(postCategories$)
		.values({
			...input,
			slug: text.slug(input.name),
		})
		.returning();
	if (!category)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create post category" });
	return category;
};

const update = async (input: PostCategoryUpdateDTO): Promise<PostCategory> => {
	const { id, ...data } = input;
	const [category] = await db
		.update(postCategories$)
		.set(data)
		.where(eq(postCategories$.id, id))
		.returning();
	if (!category)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update post category" });
	return category;
};

export const postCategoriesUseCases = {
	findAll,
	findAllPublic,
	findBySlug,
	findById,
	create,
	update,
};
