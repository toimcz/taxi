import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { CarCreateDTO, CarUpdateDTO } from "./cars.input";
import { Car } from "./cars.output";

const tags = ["Cars"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/cars${path}`;

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(CarCreateDTO)
	.output(Car);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/"),
		tags,
	})
	.input(CarUpdateDTO)
	.output(Car);

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Car);

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.output(array(Car));

export const carsAdminContract = {
	create,
	update,
	findById,
	findAll,
};
