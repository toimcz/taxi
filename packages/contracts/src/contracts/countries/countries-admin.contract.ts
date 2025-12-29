import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { CountryCreateDTO, CountryUpdateDTO } from "./countries.input";
import { Country } from "./countries.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/countries",
	})
	.output(array(Country));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/countries/{id}",
	})
	.input(ParamUUID)
	.output(Country);
const create = contract
	.route({
		method: "POST",
		path: "/admin/countries",
	})
	.input(CountryCreateDTO)
	.output(Country);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/countries/{id}",
	})
	.input(CountryUpdateDTO)
	.output(Country);

export const countriesAdminContract = {
	findAll,
	findById,
	create,
	update,
};
