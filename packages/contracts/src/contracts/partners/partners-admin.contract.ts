import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PartnerCreateDTO, PartnerUpdateDTO } from "./partners.input";
import { Partner, PartnerItem } from "./partners.output";

const tags = ["Partners"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/partners${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/"),
		tags,
	})
	.output(array(PartnerItem));

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Partner);

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(PartnerCreateDTO)
	.output(Partner);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/"),
		tags,
	})
	.input(PartnerUpdateDTO)
	.output(Partner);

export const partnersAdminContract = {
	findAll,
	findById,
	create,
	update,
};
