import type { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract";
import { array } from "valibot";
import { ApiData, PaginationParamsDTO, ParamUUID } from "../common";
import { contract } from "../contract";
import { UserCreateDTO, UserFindByEmailDTO, UsersSearchDTO, UserUpdateDTO } from "./users.input";
import { User, UserItem } from "./users.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/users",
	})
	.input(PaginationParamsDTO)
	.output(ApiData(array(UserItem)));

const findById = contract
	.route({
		method: "GET",
		path: "/admin/users/{id}",
	})
	.input(ParamUUID)
	.output(User);

const findByEmail = contract
	.route({
		method: "GET",
		path: "/admin/users/email/{email}",
	})
	.input(UserFindByEmailDTO)
	.output(User);

const search = contract
	.route({
		method: "GET",
		path: "/admin/users/search",
	})
	.input(UsersSearchDTO)
	.output(ApiData(array(UserItem)));

const create = contract
	.route({
		method: "POST",
		path: "/admin/users",
	})
	.input(UserCreateDTO)
	.output(User);

const update = contract
	.route({
		method: "PUT",
		path: "/admin/users/{id}",
	})
	.input(UserUpdateDTO)
	.output(User);

export const usersAdminContract = {
	findAll,
	findById,
	findByEmail,
	search,
	create,
	update,
};

export type UsersAdminContractInputs = InferContractRouterInputs<typeof usersAdminContract>;
export type UsersAdminContractOutputs = InferContractRouterOutputs<typeof usersAdminContract>;
