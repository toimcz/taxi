import { createORPCClient, createSafeClient, ORPCError, onError } from "@orpc/client";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import type { ContractRouterClient } from "@orpc/contract";
import { ResponseValidationPlugin } from "@orpc/contract/plugins";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contracts } from "@taxi/contracts";
import { getRequestEvent } from "$app/server";
import { API_URL } from "$env/static/private";

const link = new OpenAPILink(contracts, {
	url: API_URL,
	fetch: async (input: RequestInfo, init?: RequestInit) => {
		const { fetch } = getRequestEvent();
		return await fetch(input, init);
	},
	interceptors: [
		onError((error) => {
			if (error instanceof ORPCError) {
				if ("issues" in error.data) {
					console.log(error.data.issues);
				}
			}
		}),
	],
	plugins: [new SimpleCsrfProtectionLinkPlugin(), new ResponseValidationPlugin(contracts)],
});

const c: ContractRouterClient<typeof contracts> = createORPCClient(link);
export const client = createSafeClient(c);
export const auth = client.auth;
export const admin = client.admin;
export const query = c.admin;
export const mutation = admin;
