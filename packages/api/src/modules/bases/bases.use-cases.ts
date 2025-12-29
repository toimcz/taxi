import type {
	ApiData,
	Base,
	BaseCreateDTO,
	BaseItem,
	BaseUpdateDTO,
	BaseWithCars,
	PaginationParamsDTO,
	Place,
	Point,
} from "@taxi/contracts";
import { type BaseInsert, bases$, cars$, db } from "@taxi/db";
import { eq } from "drizzle-orm";
import type { InferOutput } from "valibot";
import { haversine } from "../../lib/haversine-distance";
import { countriesUseCases } from "../countries";
import { placesUseCases } from "../places";

const create = async (input: BaseCreateDTO): Promise<Omit<InferOutput<typeof Base>, "cars">> => {
	const country = await countriesUseCases.findById(input.countryId);
	if (!country) {
		throw new Error("Country not found");
	}
	const city = await placesUseCases.findByName([input.city, country.name].join(", "));
	if (!city || !city.isCity) {
		throw new Error("Base not found");
	}
	const baseInsert = $parseBaseFromPlace(city, input);
	const [base] = await db.insert(bases$).values(baseInsert).returning();
	if (!base) {
		throw new Error("Failed to create base");
	}
	return {
		...base,
		country: country.name,
	};
};

const update = async (input: BaseUpdateDTO): Promise<Base> => {
	await db.update(bases$).set(input).where(eq(bases$.id, input.id)).returning();
	const base = await findById(input.id);
	if (!base) {
		throw new Error("Base not found");
	}
	return base;
};

const findAll = async (pagination: PaginationParamsDTO): Promise<ApiData<BaseItem[]>> => {
	const page = Number(pagination.page ?? 1);
	const limit = Number(pagination.limit ?? 10);
	const offset = page ? (page - 1) * limit : 0;
	const bases = await db.query.bases$.findMany({
		limit,
		offset,
		with: {
			country: {
				columns: {
					name: true,
				},
			},
		},
	});
	return {
		data: bases.map((base) => ({
			...base,
			country: base.country.name,
		})),
		meta: {
			total: bases.length,
			page: page,
			limit: limit,
			totalPages: Math.ceil(bases.length / limit),
		},
	};
};

const findActive = async (): Promise<{
	data: BaseItem[];
}> => {
	const bases = await db.query.bases$.findMany({
		where: eq(bases$.status, true),
		with: {
			country: {
				columns: {
					name: true,
				},
			},
		},
	});
	return {
		data: bases.map((base) => ({
			...base,
			country: base.country.name,
		})),
	};
};

const findById = async (id: string): Promise<BaseWithCars | undefined> => {
	const base = await db.query.bases$.findFirst({
		where: eq(bases$.id, id),
		with: {
			cars: true,
			country: {
				columns: {
					name: true,
				},
			},
		},
	});
	if (!base) {
		throw new Error("Base not found");
	}
	return {
		...base,
		country: base.country.name,
		cars: base.cars.map((car) => ({
			...car,
			tags: car.tags?.join(", ") ?? "",
		})),
	};
};

const findByIdWithActiveCars = async (id: string): Promise<BaseWithCars | undefined> => {
	const base = await db.query.bases$.findFirst({
		where: eq(bases$.id, id),
		with: {
			country: {
				columns: {
					name: true,
				},
			},
			cars: {
				where: eq(cars$.status, true),
			},
		},
	});
	if (!base) {
		throw new Error("Base not found");
	}
	return {
		...base,
		country: base.country.name,
		cars: base.cars.map((car) => ({
			...car,
			tags: car.tags?.join(", ") ?? "",
		})),
	};
};

const findOptimal = async (from: Point, to: Point): Promise<Base | undefined> => {
	const { data: bases } = await findActive();
	let baseId: string | null = null;
	let minDistance = Number.POSITIVE_INFINITY;
	let minDistanceToPickup = Number.POSITIVE_INFINITY;

	for (const base of bases) {
		if (!base.lat || !base.lng) {
			continue;
		}

		// Convert Point type to LatLng for haversine
		const fromLatLng = { lat: Number(from.lat), lng: Number(from.lng) };
		const toLatLng = { lat: Number(to.lat), lng: Number(to.lng) };
		const baseLatLng = { lat: Number(base.lat), lng: Number(base.lng) };

		const distanceToPickup = haversine(baseLatLng, fromLatLng) - base.strength * 1000;
		const distance = haversine(fromLatLng, toLatLng);
		const distanceToBase = haversine(toLatLng, baseLatLng);

		// Convert meters to kilometers for strength calculation
		const tripDistance = (distanceToPickup + distance + distanceToBase) / 1000;

		// If distances are equal (within 1km), prefer shorter pickup distance
		if (Math.abs(tripDistance - minDistance) < 1) {
			if (distanceToPickup < minDistanceToPickup) {
				minDistance = tripDistance;
				minDistanceToPickup = distanceToPickup;
				baseId = base.id;
			}
		} else if (tripDistance < minDistance) {
			minDistance = tripDistance;
			minDistanceToPickup = distanceToPickup;
			baseId = base.id;
		}
	}
	if (!baseId) {
		throw new Error("No suitable base found");
	}
	return findByIdWithActiveCars(baseId);
};

function $parseBaseFromPlace(place: Place, input: BaseCreateDTO): BaseInsert {
	return {
		city: place.city,
		countryId: place.countryId,
		lat: place.lat,
		lng: place.lng,
		koeficient: input.koeficient,
		status: input.status,
		placeId: place.placeId,
		strength: input.strength,
	};
}

export const basesUseCases = {
	create,
	update,
	findAll,
	findActive,
	findById,
	findByIdWithActiveCars,
	findOptimal,
};
