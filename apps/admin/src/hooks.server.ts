import { sequence } from "@sveltejs/kit/hooks";
import { authHandler } from "./lib/handlers/auth.handler";

export const handle = sequence(authHandler);
