import { treaty } from "@elysiajs/eden";
import type { App } from "@taxi/server";
import { PUBLIC_API_URL } from "$env/static/public";

const client = treaty<App>(PUBLIC_API_URL);

export default client;
