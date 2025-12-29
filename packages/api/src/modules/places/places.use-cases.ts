import type { Place, PlaceCreateDTO } from "@taxi/contracts";
import { db, type PlaceSelect, places$ } from "@taxi/db";
import { config } from "../../config";
import { GooglePlaceService } from "../../lib/google";
import { text } from "../../lib/text";
import { countriesUseCases } from "../countries";
import { getFindPlaceById, getFindPlaceByLabel, getFindPlaceByPlaceId } from "./places.prepare";

const create = async (input: PlaceCreateDTO): Promise<Place> => {
	const country = await countriesUseCases.findByName(input.country);
	if (!country) {
		throw new Error("Country not found");
	}
	const name = _removeCityAndCountry(input.place, input.city, input.country);
	const slug = text.slug(name);
	const [place] = await db
		.insert(places$)
		.values({
			...input,
			place: name,
			slug,
			countryId: country.id,
			lat: input.lat,
			lng: input.lng,
		})
		.onConflictDoUpdate({
			target: places$.placeId,
			set: input,
		})
		.returning();

	if (!place) {
		throw new Error("Failed to create place");
	}

	return _mapToPlace({
		...place,
		country: { name: country.name },
	});
};

const findById = async (id: string): Promise<Place | undefined> => {
	const place = await getFindPlaceById.execute({ id });
	return place ? _mapToPlace(place) : undefined;
};

const findByPlaceId = async (placeId: string): Promise<Place | undefined> => {
	const place = await getFindPlaceByPlaceId.execute({ placeId });
	if (place) {
		const country = await countriesUseCases.findById(place.countryId);
		if (!country) {
			return undefined;
		}
		return {
			...place,
			country: country.name,
			isCity: place.type === "city",
		};
	}

	return await _findByGooglePlaceId(placeId);
};

const findByName = async (label: string): Promise<Place | undefined> => {
	const place = await getFindPlaceByLabel.execute({ label });
	if (place) {
		const country = await countriesUseCases.findById(place.countryId);
		if (country) {
			return _mapToPlace({
				...place,
				country: { name: country.name },
			});
		}
	}
	return await _findByGooglePlaceId(label);
};

const findByNameOrPlaceId = async ({
	name,
	placeId,
}: {
	name: string;
	placeId?: string;
}): Promise<Place | undefined> => {
	if (placeId) {
		const place = await findByPlaceId(placeId);
		if (place) {
			return place;
		}
	}
	return await findByName(name);
};

const _findByGooglePlaceId = async (placeId: string): Promise<Place | undefined> => {
	const googlePlaceService = new GooglePlaceService(config.GOOGLE_API_KEY);
	const googlePlace = await googlePlaceService.getByPlaceId(placeId);
	if (!googlePlace) {
		return undefined;
	}
	const country = await countriesUseCases.findByName(googlePlace.country);
	if (!country) {
		return undefined;
	}
	const name = _removeCityAndCountry(googlePlace.name, googlePlace.city, googlePlace.country);
	const payload = {
		place: name,
		slug: text.slug(googlePlace.label),
		placeId: googlePlace.placeId,
		city: googlePlace.city,
		countryId: country.id,
		label: googlePlace.label,
		type: googlePlace.type,
		lat: googlePlace.lat,
		lng: googlePlace.lng,
	};
	const [createdPlace] = await db
		.insert(places$)
		.values(payload)
		.onConflictDoUpdate({
			target: places$.placeId,
			set: payload,
		})
		.returning();
	return createdPlace
		? _mapToPlace({
				...createdPlace,
				country: { name: country.name },
			})
		: undefined;
};

function _removeCityAndCountry(place: string, city: string, country: string) {
	return place
		.split(",")
		.filter((p) => p !== city && p !== country)
		.join(",");
}

function _mapToPlace(place: PlaceSelect & { country: { name: string } }): Place {
	return {
		...place,
		country: place.country.name,
		isCity: place.type === "city",
	};
}

export const placesUseCases = {
	create,
	findById,
	findByPlaceId,
	findByName,
	findByNameOrPlaceId,
};
