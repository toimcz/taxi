import { implement, ORPCError } from "@orpc/server";
import { countriesAdminContract } from "@taxi/contracts";
import { countriesUseCases } from "./countries.use-cases";

const countriesOs = implement(countriesAdminContract);

const findAll = countriesOs.findAll.handler(async () => {
	const countries = await countriesUseCases.findAll();
	return countries;
});

const findById = countriesOs.findById.handler(async ({ input }) => {
	const country = await countriesUseCases.findById(input.id);
	if (!country) {
		throw new ORPCError("NOT_FOUND", { message: "Country not found" });
	}
	return country;
});

const create = countriesOs.create.handler(async ({ input }) => {
	const country = await countriesUseCases.create(input);
	return country;
});

const update = countriesOs.update.handler(async ({ input }) => {
	const country = await countriesUseCases.update(input.id, input);
	return country;
});

export const countriesAdminHandler = {
	findAll,
	findById,
	create,
	update,
};
