import { ORPCError } from "@orpc/contract";
import type {
	ApiData,
	PaginationParamsDTO,
	Post,
	PostCreateDTO,
	PostFindBySlugDTO,
	PostUpdateDTO,
} from "@taxi/contracts";
import { type Database, db, postCategories$, posts$ } from "@taxi/db";
import { and, count, desc, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { DigitalOceanStorageService } from "../../lib/storage/do.storage";
import { text } from "../../lib/text";

const selectPost = (db: Database) => {
	return db.select({
		id: posts$.id,
		title: posts$.title,
		description: posts$.description,
		content: posts$.content,
		url: sql<string>`concat('/', ${postCategories$.slug}, '/', ${posts$.slug})`.as("url"),
		slug: posts$.slug,
		tags: posts$.tags,
		photo: posts$.photo,
		public: posts$.public,
		publishAt: posts$.publishAt,
		expiresAt: posts$.expiresAt,
		createdAt: posts$.createdAt,
		updatedAt: posts$.updatedAt,
		createdById: posts$.createdById,
		updatedById: posts$.updatedById,
		categoryId: posts$.categoryId,
		categoryName: postCategories$.name,
		categorySlug: postCategories$.slug,
	});
};

const storageService = new DigitalOceanStorageService();

const create = async (input: PostCreateDTO, createdById: string): Promise<Post> => {
	const buffer = Buffer.from(await input.image.arrayBuffer());
	const photo = await storageService.storePostImage(buffer, input.title);
	const { image: _, ...rest } = input;
	const [created] = await db
		.insert(posts$)
		.values({
			...rest,
			slug: text.slug(input.title),
			tags: input.tags.split(",").map((tag) => tag.trim()),
			publishAt: new Date(input.publishAt),
			expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
			photo,
			createdById,
			updatedById: createdById,
		})
		.returning();
	if (!created) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create post" });
	}
	const post = await findById(created.id);
	if (!post) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to retrieve created post" });
	}
	return post;
};

const update = async (input: PostUpdateDTO, updatedById: string): Promise<Post> => {
	const { image, id, ...rest } = input;
	let photo: string | undefined;
	if (image) {
		const buffer = Buffer.from(await image.arrayBuffer());
		photo = await storageService.storePostImage(buffer, input.title);
	}
	const [updated] = await db
		.update(posts$)
		.set({
			...rest,
			tags: input.tags.split(",").map((tag) => tag.trim()),
			publishAt: input.publishAt ? new Date(input.publishAt) : undefined,
			expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
			...(photo && { photo }),
			updatedById,
		})
		.where(eq(posts$.id, id))
		.returning();
	if (!updated) throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update post" });
	const post = await findById(updated.id);
	if (!post) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to retrieve updated post" });
	}
	return post;
};

const findAll = async (input: PaginationParamsDTO): Promise<ApiData<Post[]>> => {
	const page = input.page ?? 1;
	const limit = input.limit ?? 10;
	const offset = page ? (page - 1) * limit : 0;
	const [total, posts] = await db.batch([
		db.select({ count: count() }).from(posts$),
		selectPost(db)
			.from(posts$)
			.innerJoin(postCategories$, eq(posts$.categoryId, postCategories$.id))
			.limit(limit)
			.offset(offset)
			.orderBy(desc(posts$.createdAt)),
	]);
	const totalCount = total[0]?.count;
	return {
		data: posts,
		meta: {
			total: Number(totalCount),
			page,
			limit,
			totalPages: Math.ceil(Number(totalCount) / limit),
		},
	};
};

const findAllPublic = async (input: PaginationParamsDTO): Promise<ApiData<Post[]>> => {
	const page = input.page ?? 1;
	const limit = input.limit ?? 10;
	const offset = page ? (page - 1) * limit : 0;

	const publicFilter = and(
		eq(posts$.public, true),
		lte(posts$.publishAt, new Date()),
		or(isNull(posts$.expiresAt), gte(posts$.expiresAt, new Date())),
	);

	const [total, posts] = await db.batch([
		db.select({ count: count() }).from(posts$).where(publicFilter),
		selectPost(db)
			.from(posts$)
			.where(publicFilter)
			.innerJoin(postCategories$, eq(posts$.categoryId, postCategories$.id))
			.limit(limit)
			.offset(offset)
			.orderBy(desc(posts$.createdAt)),
	]);
	const totalCount = total[0]?.count;
	return {
		data: posts,
		meta: {
			total: Number(totalCount),
			page,
			limit,
			totalPages: Math.ceil(Number(totalCount) / limit),
		},
	};
};

const findById = async (id: string): Promise<Post | undefined> => {
	const post = await selectPost(db)
		.from(posts$)
		.innerJoin(postCategories$, eq(posts$.categoryId, postCategories$.id))
		.where(eq(posts$.id, id))
		.limit(1);
	return post[0];
};

const findBySlug = async (input: PostFindBySlugDTO): Promise<Post | undefined> => {
	return await selectPost(db)
		.from(posts$)
		.innerJoin(postCategories$, eq(posts$.categoryId, postCategories$.id))
		.where(and(eq(postCategories$.slug, input.categoryslug), eq(posts$.slug, input.postslug)))
		.limit(1)
		.then(([post]) => post);
};

export const postsUseCases = {
	create,
	update,
	findAll,
	findById,
	findBySlug,
	findAllPublic,
};
