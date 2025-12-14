import { treaty } from "@elysiajs/eden";
import type { App } from "@taxi/server";
import { getRequestEvent } from "$app/server";

const server = () => {
	const { fetch } = getRequestEvent();
	return treaty<App>("https://localhost:4000", {
		fetcher: fetch,
	});
};
const api = () => server().api.admin;
const auth = () => server().api.auth;
export { api, auth };
