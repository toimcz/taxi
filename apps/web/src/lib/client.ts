import { treaty } from "@elysiajs/eden";
import type { App } from "@taxi/server";

const server = treaty<App>("https://localhost:4000");
const client = server.api.web;

export { client };
