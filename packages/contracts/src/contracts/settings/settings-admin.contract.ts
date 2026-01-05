import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { SettingCreateDTO, SettingUpdateDTO } from "./settings.input";
import { Setting } from "./settings.output";

const tags = ["Settings"];
const setPath = (path: `/${string}`): HTTPPath => `/admin${path}`;

const findAll = contract
	.route({
		method: "GET",
		path: setPath("/settings"),
		tags,
	})
	.output(array(Setting));

const create = contract
	.route({
		method: "POST",
		path: setPath("/settings"),
		tags,
	})
	.input(SettingCreateDTO)
	.output(Setting);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/settings/{id}"),
		tags,
	})
	.input(SettingUpdateDTO)
	.output(Setting);

const remove = contract
	.route({
		method: "DELETE",
		path: setPath("/settings/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Setting);

const findById = contract
	.route({
		method: "GET",
		path: setPath("/settings/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Setting);

export const settingsAdminContract = {
	findAll,
	create,
	update,
	delete: remove,
	findById,
};
