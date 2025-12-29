import { array, boolean, type InferOutput, number, object, pipe, string, uuid } from "valibot";

export const Place = object({
	id: pipe(string(), uuid()),
	place: string(),
	lat: number(),
	lng: number(),
	type: string(),
	slug: string(),
	city: string(),
	country: string(),
	countryId: string(),
	label: string(),
	placeId: string(),
	isCity: boolean(),
});

export type Place = InferOutput<typeof Place>;

/**
 * Google Places Autocomplete suggestion schema
 * Used for validating autocomplete API responses
 */
export const AutocompleteSuggestion = object({
	placePrediction: object({
		placeId: string(),
		text: object({
			text: string(),
		}),
		structuredFormat: object({
			mainText: object({
				text: string(),
			}),
			secondaryText: object({
				text: string(),
			}),
		}),
		types: array(string()),
	}),
});

export type AutocompleteSuggestion = InferOutput<typeof AutocompleteSuggestion>;
