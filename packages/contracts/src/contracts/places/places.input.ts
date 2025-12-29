import {
	type InferOutput,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	pipe,
	string,
	transform,
} from "valibot";

export const PlaceCreateInput = object({
	place: pipe(string(), minLength(2), maxLength(256)),
	placeId: pipe(string(), minLength(2)),
	city: pipe(string(), minLength(2), maxLength(100)),
	country: pipe(string(), minLength(2), maxLength(100)),
	label: pipe(string(), minLength(2), maxLength(256)),
	type: pipe(string(), minLength(2), maxLength(160)),
	lat: pipe(string(), transform(Number), number(), minValue(-90), maxValue(90)),
	lng: pipe(string(), transform(Number), number(), minValue(-180), maxValue(180)),
});

export const PlaceCreateDTO = object({
	place: pipe(string(), minLength(2), maxLength(256)),
	placeId: pipe(string(), minLength(2)),
	city: pipe(string(), minLength(2), maxLength(100)),
	country: pipe(string(), minLength(2), maxLength(100)),
	label: pipe(string(), minLength(2), maxLength(256)),
	type: pipe(string(), minLength(2), maxLength(160)),
	lat: pipe(number(), minValue(-90), maxValue(90)),
	lng: pipe(number(), minValue(-180), maxValue(180)),
});

export type PlaceCreateDTO = InferOutput<typeof PlaceCreateDTO>;

export const PlaceSearchInput = object({
	query: pipe(string(), minLength(2)),
});

export const PlaceSearchDTO = PlaceSearchInput;

export type PlaceSearchDTO = InferOutput<typeof PlaceSearchDTO>;

export const AutocompleteQueryInput = object({
	query: pipe(string("Pole musí být řetězec"), minLength(1, "Pole je povinné")),
	sessionToken: pipe(string("Pole musí být řetězec"), minLength(1, "Pole je povinné")),
});

export const AutocompleteQueryDTO = AutocompleteQueryInput;

export type AutocompleteQueryDTO = InferOutput<typeof AutocompleteQueryDTO>;
