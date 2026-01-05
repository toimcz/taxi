import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { DriverCreateDTO, DriverUpdateDTO } from "./drivers.input";
import { Driver, DriverItem } from "./drivers.output";

const tags = ["Drivers"];

const setPath = (path: HTTPPath): HTTPPath => `/admin/drivers${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.output(array(DriverItem));

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Driver);

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(DriverCreateDTO)
	.output(Driver);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/{id}"),
		tags,
	})
	.input(DriverUpdateDTO)
	.output(Driver);

export const driversAdminContract = {
	findAll,
	findById,
	create,
	update,
};
