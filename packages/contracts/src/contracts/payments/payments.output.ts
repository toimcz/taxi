import { enum_, type InferOutput, nullable, number, object, string } from "valibot";
import { BillingDetail, DateFormat, PaymentStatus } from "../common";

export const Payment = object({
	id: number(),
	paymentId: string(),
	invoiceId: nullable(number()),
	amount: number(),
	referenceId: string(),
	vatRate: number(),
	currency: string(),
	description: string(),
	paymentMethodId: string(),
	paymentMethod: string(),
	paymentIntentId: nullable(string()),
	clientSecret: nullable(string()),
	status: enum_(PaymentStatus),
	paidAt: nullable(DateFormat),
	dueAt: DateFormat,
	createdAt: DateFormat,
	updatedAt: DateFormat,
	cancelledAt: nullable(DateFormat),
	billingDetails: BillingDetail,
});

export const PaymentItem = object({
	id: number(),
	paymentId: string(),
	invoiceId: nullable(number()),
	amount: number(),
	vatRate: number(),
	currency: string(),
	description: string(),
	paymentMethod: string(),
	status: enum_(PaymentStatus),
	paidAt: nullable(DateFormat),
	dueAt: DateFormat,
	createdAt: DateFormat,
	cancelledAt: nullable(DateFormat),
});

export type Payment = InferOutput<typeof Payment>;
export type PaymentItem = InferOutput<typeof PaymentItem>;
