import { type InferInput, number, object, optional, string } from "valibot";

export const PaginationParamsInput = object({
	page: optional(number()),
	limit: optional(number()),
});

export type PaginationParamsInput = InferInput<typeof PaginationParamsInput>;

export const ErrorResponse = object({
	status: number(),
	message: string(),
});

export type ErrorResponse = InferInput<typeof ErrorResponse>;

export type BillingDetail = {
	name: string;
	company: string;
	street: string;
	city: string;
	zip: string;
	country: string;
	ic: string;
	dic: string;
};
export const Role = {
	USER: "user",
	ADMIN: "admin",
	DRIVER: "driver",
	PARTNER: "partner",
	SUPERVISOR: "supervisor",
	ACCOUNTANT: "accountant",
	DEV: "dev",
	EDITOR: "editor",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const EmailStatus = {
	CREATED: "CREATED",
	SENT: "SENT",
	DELIVERED: "DELIVERED",
	FIRST_OPENING: "FIRST_OPENING",
	OPENED: "OPENED",
	CLICKED: "CLICKED",
	INVALID_EMAIL: "INVALID_EMAIL",
};

export type EmailStatus = (typeof EmailStatus)[keyof typeof EmailStatus];

export const OrderItemVariants = {
	TRANSFER: "TRANSFER",
	TAXI: "TAXI",
	DELIVERY: "DELIVERY",
} as const;

export type OrderItemVariants =
	(typeof OrderItemVariants)[keyof typeof OrderItemVariants];

export const Title = {
	Mr: "Mr",
	Mrs: "Mrs",
	Ms: "Ms",
	Miss: "Miss",
	Dr: "Dr",
} as const;

export type Title = (typeof Title)[keyof typeof Title];

export const PaymentMethodProvider = {
	STRIPE: "stripe",
	LOCAL: "local",
};

export type PaymentMethodProvider =
	(typeof PaymentMethodProvider)[keyof typeof PaymentMethodProvider];

export const PaymentStatus = {
	CREATED: "CREATED",
	SUCCEEDED: "SUCCEEDED",
	FAILED: "FAILED",
	PREPAID: "PREPAID",
	CANCELED: "CANCELED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const RideStatus = {
	CONFIRMED: "CONFIRMED",
	CANCELLED: "CANCELLED",
	PENDING: "PENDING",
} as const;

export type RideStatus = (typeof RideStatus)[keyof typeof RideStatus];

export const IssueStatus = {
	CREATED: "CREATED",
	PROCESSING: "PROCESSING",
	RESOLVED: "RESOLVED",
	CLOSED: "CLOSED",
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssuePriority = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
	CRITICAL: "CRITICAL",
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];

export const RideType = {
	RIDE: "RIDE",
	HIRE: "HIRE",
	DAYTRIP: "DAYTRIP",
	DELIVERY: "DELIVERY",
} as const;

export type RideType = (typeof RideType)[keyof typeof RideType];

export const RidePriceCalculationType = {
	FIXED: "FIXED",
	PER_KM: "PER_KM",
	PER_HOUR: "PER_HOUR",
} as const;

export type RidePriceCalculationType =
	(typeof RidePriceCalculationType)[keyof typeof RidePriceCalculationType];

export const OrderStatus = {
	CREATED: "CREATED",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
