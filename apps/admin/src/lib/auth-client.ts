import type { auth } from "@taxi/auth";
import type { DBFieldAttribute, DBFieldType } from "better-auth";
import {
	customSessionClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte"; // make sure to import from better-auth/svelte

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

export const { signIn, signUp, signOut, useSession, $ERROR_CODES } =
	createAuthClient({
		basePath: "/api/auth",
		plugins: [
			inferAdditionalFields({
				user: {
					...additionalFields,
				},
			}),
			customSessionClient<typeof auth>(),
		],
	});
