import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PaymentMethodCreateDTO, PaymentMethodUpdateDTO } from "./payment-methods.input";
import { PaymentMethod } from "./payment-methods.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/payment-methods",
	})
	.output(array(PaymentMethod));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/payment-methods/{id}",
	})
	.input(ParamUUID)
	.output(PaymentMethod);
const create = contract
	.route({
		method: "POST",
		path: "/admin/payment-methods",
	})
	.input(PaymentMethodCreateDTO)
	.output(PaymentMethod);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/payment-methods/{id}",
	})
	.input(PaymentMethodUpdateDTO)
	.output(PaymentMethod);

export const paymentMethodsAdminContract = {
	findAll,
	findById,
	create,
	update,
};
