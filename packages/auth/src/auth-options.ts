import type {
	BetterAuthOptions,
	DBFieldAttribute,
	DBFieldType,
} from "better-auth";

export const additionalFields = {
	firstName: {
		type: "string",
		input: true,
		required: true,
	},
	lastName: {
		type: "string",
		input: true,
		required: true,
	},
	phone: {
		type: "string",
		input: true,
	},
	role: {
		type: "string",
		input: false,
		required: true,
		defaultValue: "user",
	},
	note: {
		type: "string",
		input: true,
		required: true,
		defaultValue: "",
	},
	billingDetails: {
		type: "json",
		input: true,
		required: true,
	},
	lastLoginAt: {
		type: "date",
		input: false,
	},
} as const satisfies Record<string, DBFieldAttribute<DBFieldType>>;

export const authOptions = {
	advanced: {
		database: {
			generateId: "uuid",
		},
		cookiePrefix: "_a_",
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	user: {
		modelName: "users",
		additionalFields,
	},
} as const satisfies BetterAuthOptions;
