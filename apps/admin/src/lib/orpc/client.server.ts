import { createORPCClient, createSafeClient, onError } from "@orpc/client";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import type { ContractRouterClient } from "@orpc/contract";
import { ResponseValidationPlugin } from "@orpc/contract/plugins";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contracts } from "@taxi/contracts";
import { getRequestEvent } from "$app/server";
import { API_URL } from "$env/static/private";

const link = new OpenAPILink(contracts, {
	url: API_URL,
	fetch(input: RequestInfo, init?: RequestInit) {
		const { fetch } = getRequestEvent();
		return fetch(input, init);
	},
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [new SimpleCsrfProtectionLinkPlugin(), new ResponseValidationPlugin(contracts)],
});

const c: ContractRouterClient<typeof contracts> = createORPCClient(link);
export const client = createSafeClient(c);
export const auth = client.auth;
export const admin = client.admin;
