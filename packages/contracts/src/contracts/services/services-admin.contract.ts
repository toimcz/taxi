import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { ServiceCreateDTO, ServiceUpdateDTO } from "./services.input";
import { Service } from "./services.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/services",
	})
	.output(array(Service));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/services/{id}",
	})
	.input(ParamUUID)
	.output(Service);
const create = contract
	.route({
		method: "POST",
		path: "/admin/services",
	})
	.input(ServiceCreateDTO)
	.output(Service);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/services/{id}",
	})
	.input(ServiceUpdateDTO)
	.output(Service);

export const servicesAdminContract = {
	findAll,
	findById,
	create,
	update,
};
