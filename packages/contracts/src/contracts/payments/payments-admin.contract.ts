import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PaymentCreateDTO, PaymentUpdateDTO } from "./payments.input";
import { Payment, PaymentItem } from "./payments.output";

const tags = ["Payments"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/payments${path}`;

const findLatest = contract
	.route({
		method: "GET",
		path: setPath("/latest"),
		tags,
	})
	.output(array(PaymentItem));

const findById = contract
	.route({
		method: "GET",
		path: setPath("/{id}"),
		tags,
	})
	.input(ParamUUID)
	.output(Payment);

const create = contract
	.route({
		method: "POST",
		path: setPath("/"),
		tags,
	})
	.input(PaymentCreateDTO)
	.output(Payment);

const update = contract
	.route({
		method: "PUT",
		path: setPath("/"),
		tags,
	})
	.input(PaymentUpdateDTO)
	.output(Payment);

export const paymentsAdminContract = {
	findLatest,
	findById,
	create,
	update,
};
