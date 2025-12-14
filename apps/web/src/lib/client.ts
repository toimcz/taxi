import { treaty } from "@elysiajs/eden";
import type { App } from "@taxi/server";

const client = treaty<App>("https://localhost:4000");

export default client;
