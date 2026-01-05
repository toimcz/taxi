import { ORPCError } from "@orpc/contract";
import type { Car, CarCreateDTO, CarUpdateDTO } from "@taxi/contracts";
import { type CarSelect, cars$, db } from "@taxi/db";
import { eq } from "drizzle-orm";
import { DigitalOceanStorageService } from "../../lib/storage/do.storage";

const relation = {
	base: {
		columns: {
			city: true,
		},
	},
} as const;

const create = async (input: CarCreateDTO): Promise<Car> => {
	const buffer = Buffer.from(await input.image.arrayBuffer());
	const storageService = new DigitalOceanStorageService();
	const photo = await storageService.storeCarImage(buffer, input.name);
	const [created] = await db
		.insert(cars$)
		.values({
			...input,
			photo,
			tags: input.tags ? input.tags.split(",").map((tag) => tag.trim()) : [],
		})
		.returning();
	if (!created) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create car" });
	}
	const car = await findById(created.id);
	if (!car) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to retrieve created car" });
	}
	return car;
};

const update = async (input: CarUpdateDTO): Promise<Car> => {
	let photo: string | undefined;
	if (input.image) {
		const buffer = Buffer.from(await input.image.arrayBuffer());
		const storageService = new DigitalOceanStorageService();
		photo = await storageService.storeCarImage(buffer, input.name);
	}
	const [updated] = await db
		.update(cars$)
		.set({
			...input,
			photo,
			tags: input.tags ? input.tags.split(",").map((tag) => tag.trim()) : [],
		})
		.where(eq(cars$.id, input.id))
		.returning();
	if (!updated) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update car" });
	}
	const car = await findById(updated.id);
	if (!car) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to retrieve updated car" });
	}
	return car;
};

const findById = async (id: string): Promise<Car | undefined> => {
	const car = await db.query.cars$.findFirst({
		where: eq(cars$.id, id),
		with: relation,
	});
	if (!car) {
		return undefined;
	}
	return mapToCar(car);
};

const findAll = async (): Promise<Car[]> => {
	const cars = await db.query.cars$.findMany({
		with: relation,
	});
	return cars.map((car) => mapToCar(car));
};

const findActive = async (): Promise<Car[]> => {
	const cars = await db.query.cars$.findMany({
		where: eq(cars$.status, true),
		with: relation,
	});
	return cars.map((car) => mapToCar(car));
};

const mapToCar = (car: CarSelect & { base: { city: string } }): Car => ({
	...car,
	baseCity: car.base.city,
	tags: car.tags ? car.tags.join(", ") : "",
});

export const carsUseCases = {
	create,
	update,
	findById,
	findAll,
	findActive,
};
