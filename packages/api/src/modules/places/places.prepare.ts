import { db, places$ } from "@taxi/db";
import { eq, sql } from "drizzle-orm";

/**
 * Lazy getter for database instance to avoid initialization at module load time
 */

export const getFindPlaceById = db.query.places$
	.findFirst({
		where: eq(places$.id, sql.placeholder("id")),
		with: {
			country: {
				columns: {
					name: true,
				},
			},
		},
	})
	.prepare("findPlaceById");

export const getFindPlaceByPlaceId = db.query.places$
	.findFirst({
		where: eq(places$.placeId, sql.placeholder("placeId")),
		with: {
			country: {
				columns: {
					name: true,
				},
			},
		},
	})
	.prepare("findPlaceByPlaceId");

export const getFindPlaceByLabel = db.query.places$
	.findFirst({
		where: eq(places$.label, sql.placeholder("label")),
		with: {
			country: {
				columns: {
					name: true,
				},
			},
		},
	})
	.prepare("findPlaceByLabel");
