import {
	type BillingDetail,
	type Payment,
	type PaymentItem,
	type PaymentStatus,
	toDateFormat,
} from "@taxi/contracts";
import { db, payments$ } from "@taxi/db";
import { desc, eq } from "drizzle-orm";

const findLatest = async (): Promise<PaymentItem[]> => {
	const payments = await db.query.payments$.findMany({
		columns: {
			id: true,
			paymentId: true,
			invoiceId: true,
			amount: true,
			vatRate: true,
			currency: true,
			description: true,
			status: true,
			paidAt: true,
			dueAt: true,
			createdAt: true,
			cancelledAt: true,
		},
		with: {
			paymentMethod: {
				columns: {
					adminName: true,
				},
			},
		},
		orderBy: [desc(payments$.createdAt)],
		limit: 50,
	});

	return payments.map((payment) => mapToPaymentItem(payment));
};

const findById = async (paymentId: string): Promise<Payment | undefined> => {
	const payment = await db.query.payments$.findFirst({
		columns: {
			id: true,
			paymentId: true,
			invoiceId: true,
			referenceId: true,
			paymentMethodId: true,
			paymentIntentId: true,
			clientSecret: true,
			billingDetails: true,
			amount: true,
			vatRate: true,
			currency: true,
			description: true,
			status: true,
			paidAt: true,
			dueAt: true,
			createdAt: true,
			cancelledAt: true,
		},
		with: {
			paymentMethod: {
				columns: {
					adminName: true,
				},
			},
		},
		where: eq(payments$.paymentId, paymentId),
	});
	if (!payment) return undefined;

	return mapToPayment(payment);
};

export const paymentsUseCases = {
	findLatest,
	findById,
};

type PaymentItemRaw = {
	id: number;
	paymentId: string;
	invoiceId: number | null;
	amount: number;
	vatRate: number;
	currency: string;
	description: string;
	status: PaymentStatus;
	paidAt: Date | null;
	dueAt: Date;
	createdAt: Date;
	cancelledAt: Date | null;
	paymentMethod: {
		adminName: string;
	};
};

type PaymentRaw = PaymentItemRaw & {
	referenceId: string;
	paymentMethodId: string;
	paymentIntentId: string | null;
	clientSecret: string | null;
	billingDetails: BillingDetail;
};

const mapToPaymentItem = (payment: PaymentItemRaw): PaymentItem => {
	return {
		...payment,
		paymentMethod: payment.paymentMethod.adminName,
		createdAt: toDateFormat(payment.createdAt),
		paidAt: payment.paidAt ? toDateFormat(payment.paidAt) : null,
		dueAt: toDateFormat(payment.dueAt),
		cancelledAt: payment.cancelledAt ? toDateFormat(payment.cancelledAt) : null,
	};
};

const mapToPayment = (payment: PaymentRaw): Payment => {
	return {
		...payment,
		paymentMethod: payment.paymentMethod.adminName,
		createdAt: toDateFormat(payment.createdAt),
		updatedAt: toDateFormat(payment.createdAt),
		paidAt: payment.paidAt ? toDateFormat(payment.paidAt) : null,
		dueAt: toDateFormat(payment.dueAt),
		cancelledAt: payment.cancelledAt ? toDateFormat(payment.cancelledAt) : null,
	};
};
