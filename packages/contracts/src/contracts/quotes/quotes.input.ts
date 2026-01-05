import {
	forward,
	type InferOutput,
	integer,
	minLength,
	minValue,
	number,
	object,
	optional,
	partialCheck,
	pipe,
	regex,
	string,
	uuid,
} from "valibot";

const optionalUuidSchema = () => optional(pipe(string(), uuid()), () => Bun.randomUUIDv7());

export const QuoteCreateInput = pipe(
	object({
		id: optionalUuidSchema(),
		machineId: optionalUuidSchema(),
		fromPlaceId: optional(pipe(string(), uuid())),
		fromInput: pipe(string(), minLength(2, "Adresa musí mít alespoň 2 znaky.")),
		toPlaceId: optional(pipe(string(), uuid())),
		toInput: pipe(string(), minLength(2, "Adresa musí mít alespoň 2 znaky.")),
		date: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/, "Datum musí být ve formátu RRRR-MM-DD.")),
		time: pipe(string(), regex(/^\d{2}:\d{2}$/, "Čas musí být ve formátu HH:MM.")),
		adults: pipe(number(), integer(), minValue(0, "Počet dospělých musí být kladné číslo.")),
		children: pipe(number(), integer(), minValue(0, "Počet dětí musí být kladné číslo.")),
		infants: pipe(number(), integer(), minValue(0, "Počet kojenců musí být kladné číslo.")),
		source: optional(string(), ""),
	}),
	forward(
		partialCheck(
			[["adults"], ["children"], ["infants"]],
			(input) => input.adults + input.children + input.infants > 0,
			"Celkový počet cestujících musí být větší než nula.",
		),
		["adults"],
	),
	forward(
		partialCheck(
			[["adults"], ["children"], ["infants"]],
			(input) => input.adults + input.children + input.infants > 0,
			"Celkový počet cestujících musí být větší než nula.",
		),
		["children"],
	),
	forward(
		partialCheck(
			[["adults"], ["children"], ["infants"]],
			(input) => input.adults + input.children + input.infants > 0,
			"Celkový počet cestujících musí být větší než nula.",
		),
		["infants"],
	),
);

export type QuoteCreateInput = InferOutput<typeof QuoteCreateInput>;
