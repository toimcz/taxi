import { implement, ORPCError } from "@orpc/server";
import { paymentsAdminContract } from "@taxi/contracts";
import { paymentsUseCases } from "./payments.use-cases";

const paymentsOs = implement(paymentsAdminContract);

const findLatest = paymentsOs.findLatest.handler(async () => {
	return paymentsUseCases.findLatest();
});

const findById = paymentsOs.findById.handler(async ({ input }) => {
	const payment = await paymentsUseCases.findById(input.id);
	if (!payment) throw new ORPCError("NOT_FOUND", { message: "Payment not found" });
	return payment;
});

export const paymentsAdminHandler = {
	findLatest,
	findById,
};
