import type { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract";
import { array } from "valibot";
import { ApiData, PaginationParamsDTO, ParamUUID } from "../common";
import { contract } from "../contract";
import { BaseCreateDTO, BaseUpdateDTO } from "./bases.input";
import { Base, BaseItem, BaseWithCars } from "./bases.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/bases",
	})
	.input(PaginationParamsDTO)
	.output(ApiData(array(BaseItem)));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/bases/{id}",
	})
	.input(ParamUUID)
	.output(BaseWithCars);
const create = contract
	.route({
		method: "POST",
		path: "/admin/bases",
	})
	.input(BaseCreateDTO)
	.output(Base);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/bases/{id}",
	})
	.input(BaseUpdateDTO)
	.output(Base);

export const basesAdminContract = {
	findAll,
	findById,
	create,
	update,
};

export type BasesAdminContractInputs = InferContractRouterInputs<typeof basesAdminContract>;
export type BasesAdminContractOutputs = InferContractRouterOutputs<typeof basesAdminContract>;
