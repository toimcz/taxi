import { ORPCError } from "@orpc/contract";
import type {
	PaymentMethod,
	PaymentMethodCreateDTO,
	PaymentMethodUpdateDTO,
} from "@taxi/contracts";
import { db, paymentMethods$ } from "@taxi/db";
import { eq } from "drizzle-orm";

const findAll = async () => {
	return db.query.paymentMethods$.findMany();
};

const create = async (data: PaymentMethodCreateDTO): Promise<PaymentMethod> => {
	const [paymentMethod] = await db.insert(paymentMethods$).values(data).returning();
	if (!paymentMethod)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create payment method" });
	return paymentMethod;
};

const update = async (data: PaymentMethodUpdateDTO): Promise<PaymentMethod> => {
	const [paymentMethod] = await db
		.update(paymentMethods$)
		.set(data)
		.where(eq(paymentMethods$.id, data.id))
		.returning();
	if (!paymentMethod)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update payment method" });
	return paymentMethod;
};

const findById = async (id: string): Promise<PaymentMethod | undefined> => {
	return db.query.paymentMethods$.findFirst({ where: eq(paymentMethods$.id, id) });
};

export const paymentMethodsUseCases = {
	findAll,
	create,
	update,
	findById,
};
