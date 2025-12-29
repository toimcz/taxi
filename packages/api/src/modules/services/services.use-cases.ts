import { ORPCError } from "@orpc/contract";
import type { Service, ServiceCreateDTO, ServiceUpdateDTO } from "@taxi/contracts";
import { db, services$ } from "@taxi/db";
import { eq } from "drizzle-orm";
import { DigitalOceanStorageService } from "../../lib/storage/do.storage";
import { text } from "../../lib/text";

const findAll = async (): Promise<Service[]> => {
	return await db.query.services$.findMany();
};

const findAllPublic = async (): Promise<Service[]> => {
	return await db.query.services$.findMany({
		where: eq(services$.status, true),
	});
};

const findById = async (id: string): Promise<Service | undefined> => {
	return await db.query.services$.findFirst({
		where: eq(services$.id, id),
	});
};

const findBySlug = async (slug: string): Promise<Service | undefined> => {
	return await db.query.services$.findFirst({
		where: eq(services$.slug, slug),
	});
};

const create = async (input: ServiceCreateDTO): Promise<Service> => {
	const storage = new DigitalOceanStorageService();
	const image = await storage.storeServiceImage(input.photo, input.title);
	const [created] = await db
		.insert(services$)
		.values({
			...input,
			photo: image,
			slug: text.slug(input.title),
		})
		.returning();
	if (!created)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create service" });
	return created;
};

const update = async (input: ServiceUpdateDTO): Promise<Service> => {
	let photoName: string | undefined;
	if (input.photo) {
		const storage = new DigitalOceanStorageService();
		const image = await storage.storeServiceImage(input.photo, input.title);
		photoName = image;
	}
	const [updated] = await db
		.update(services$)
		.set({
			...input,
			photo: photoName,
			slug: text.slug(input.title),
		})
		.where(eq(services$.id, input.id))
		.returning();
	if (!updated)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update service" });
	return updated;
};

export const servicesUseCases = {
	findAll,
	findAllPublic,
	findById,
	findBySlug,
	create,
	update,
};
