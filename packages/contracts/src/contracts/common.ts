import { format } from "date-fns";
import {
	type BaseIssue,
	type BaseSchema,
	boolean,
	type FlatErrors,
	type InferInput,
	type InferOutput,
	integer,
	literal,
	maxValue,
	minValue,
	number,
	object,
	optional,
	pipe,
	regex,
	string,
	transform,
	uuid,
} from "valibot";
import { stringToNumber } from "./common-schemas";

export const ParamUUID = object({
	id: pipe(string(), uuid()),
});

export type ParamUUID = InferOutput<typeof ParamUUID>;

export const PaginationParamsInput = object({
	page: optional(
		pipe(
			string("Číslo stránky musí být řetězec"),
			transform(Number),
			number("Číslo stránky musí být číslo"),
			integer("Číslo stránky musí být celé číslo"),
			minValue(1, "Číslo stránky musí být minimálně 1"),
			transform(String),
		),
	),
	limit: optional(
		pipe(
			string("Limit musí být řetězec"),
			transform(Number),
			number("Limit musí být číslo"),
			integer("Limit musí být celé číslo"),
			minValue(1, "Limit musí být minimálně 1"),
			transform(String),
		),
	),
});

export const PaginationParamsDTO = object({
	page: optional(
		pipe(
			stringToNumber("Neplatné číslo stránky"),
			number("Číslo stránky musí být číslo"),
			integer("Číslo stránky musí být celé číslo"),
			minValue(1, "Číslo stránky musí být minimálně 1"),
		),
	),
	limit: optional(
		pipe(
			stringToNumber("Neplatné číslo limitu"),
			number("Limit musí být číslo"),
			integer("Limit musí být celé číslo"),
			minValue(1, "Limit musí být minimálně 1"),
		),
	),
});

export type PaginationParamsDTO = InferOutput<typeof PaginationParamsDTO>;

export type ValidationErrorResponse = {
	status: 400;
	message: string;
	issues: FlatErrors<undefined>;
};

export const NotFoundResponse = object({
	status: literal(404),
	message: string(),
});

export type NotFoundResponse = InferInput<typeof NotFoundResponse>;

export const UnauthorizedResponse = object({
	status: literal(401),
	message: string(),
});

export type UnauthorizedResponse = InferInput<typeof UnauthorizedResponse>;

export const ConflictResponse = object({
	status: literal(409),
	message: string(),
});

export type ConflictResponse = InferInput<typeof ConflictResponse>;

export const BadRequestResponse = object({
	status: literal(400),
	message: string(),
});

export type BadRequestResponse = InferInput<typeof BadRequestResponse>;

export const InternalServerErrorResponse = object({
	status: literal(500),
	message: string(),
});

export type InternalServerErrorResponse = InferInput<typeof InternalServerErrorResponse>;

export const PaginationMeta = object({
	total: number(),
	page: number(),
	limit: optional(number()),
	totalPages: number(),
});
export type PaginationMeta = InferOutput<typeof PaginationMeta>;

export const SuccessResponse = object({
	success: boolean(),
	message: string(),
});

export type SuccessResponse = InferOutput<typeof SuccessResponse>;

export const ApiData = <T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: T) =>
	object({
		data: schema,
		meta: optional(PaginationMeta),
	});

export type ApiData<T> = {
	data: T;
	meta?: PaginationMeta;
};

export const BillingDetail = object({
	name: string(),
	company: string(),
	street: string(),
	city: string(),
	zip: string(),
	country: string(),
	ic: string(),
	dic: string(),
});
export type BillingDetail = InferOutput<typeof BillingDetail>;

export const IdentityType = {
	EMAIL: "email",
	GOOGLE: "google",
	MAGIC: "magic",
	PASSWORD: "password",
} as const;
export type IdentityType = (typeof IdentityType)[keyof typeof IdentityType];

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

export type OrderItemVariants = (typeof OrderItemVariants)[keyof typeof OrderItemVariants];

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

export const Point = object({
	lat: pipe(number(), minValue(-90), maxValue(90)),
	lng: pipe(number(), minValue(-180), maxValue(180)),
});

export type Point = InferOutput<typeof Point>;

export const DateFormat = object({
	raw: string(),
	input: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/)),
	human: pipe(string(), regex(/^\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}$/)),
	humanDate: pipe(string(), regex(/^\d{1,2}\.\d{1,2}\.\d{4}$/)),
	humanTime: pipe(string(), regex(/^\d{1,2}:\d{2}$/)),
});

export type DateFormat = InferOutput<typeof DateFormat>;

export const toDateFormat = (date: Date | string): DateFormat => {
	try {
		if (typeof date === "string") {
			date = new Date(date);
		}

		return {
			raw: date.toISOString(),
			// biome-ignore lint/style/noNonNullAssertion: we know that the date is valid
			input: date.toISOString().split("T")[0]!,
			human: format(date, "d.M.yyyy HH:mm"),
			humanDate: format(date, "d.M.yyyy"),
			humanTime: format(date, "H:mm"),
		};
	} catch {
		throw new Error("Invalid date");
	}
};
