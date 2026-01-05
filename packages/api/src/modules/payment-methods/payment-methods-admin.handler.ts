import { implement, ORPCError } from "@orpc/server";
import { paymentMethodsAdminContract } from "@taxi/contracts";
import { paymentMethodsUseCases } from "./payment-methods.use-cases";

const paymentMethodsOs = implement(paymentMethodsAdminContract);

const findAll = paymentMethodsOs.findAll.handler(async () => {
	return await paymentMethodsUseCases.findAll();
});

const findAllActive = paymentMethodsOs.findAll.handler(async () => {
	return await paymentMethodsUseCases.findAllActive();
});

const create = paymentMethodsOs.create.handler(async ({ input }) => {
	return await paymentMethodsUseCases.create(input);
});

const update = paymentMethodsOs.update.handler(async ({ input }) => {
	return await paymentMethodsUseCases.update(input);
});

const findById = paymentMethodsOs.findById.handler(async ({ input }) => {
	const paymentMethod = await paymentMethodsUseCases.findById(input.id);
	if (!paymentMethod) {
		throw new ORPCError("NOT_FOUND", { message: "Payment method not found" });
	}
	return paymentMethod;
});

export const paymentMethodsAdminHandler = {
	findAll,
	findAllActive,
	create,
	update,
	findById,
};
