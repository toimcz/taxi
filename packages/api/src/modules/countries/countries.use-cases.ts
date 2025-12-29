import type { Country, CountryCreateDTO, CountryUpdateDTO } from "@taxi/contracts";
import { countries$, db } from "@taxi/db";
import { asc, eq } from "drizzle-orm";
import { text } from "../../lib/text";

const findById = (id: string): Promise<Country | undefined> => {
	return db.query.countries$.findFirst({
		where: (countries, { eq }) => eq(countries.id, id),
	});
};

const findByName = (name: string): Promise<Country | undefined> => {
	return db.query.countries$.findFirst({
		where: (countries, { eq }) => eq(countries.name, name),
	});
};

const findAll = (): Promise<Country[]> => {
	return db.query.countries$.findMany({
		orderBy: [asc(countries$.uname)],
	});
};

const create = async (input: CountryCreateDTO): Promise<Country> => {
	const uname = text.removeDiacritics(input.name).toLowerCase();
	const [country] = await db
		.insert(countries$)
		.values({
			...input,
			uname,
		})
		.returning();
	if (!country) {
		throw new Error("Failed to create country");
	}
	return country;
};

const update = async (id: string, input: CountryUpdateDTO): Promise<Country> => {
	const [country] = await db.update(countries$).set(input).where(eq(countries$.id, id)).returning();
	if (!country) {
		throw new Error("Failed to update country");
	}
	return country;
};

export const countriesUseCases = {
	findById,
	findByName,
	findAll,
	create,
	update,
};
