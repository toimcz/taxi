import { ORPCError, os } from "@orpc/server";
import type { AppContext } from "../context";
import { authUseCases } from "../modules/auth";

export const authGuard = os.$context<AppContext>().middleware(async ({ context, next }) => {
	if (!context.sessionId) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	const session = await authUseCases.me(context.sessionId);
	if (!session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}

	const result = await next({
		context: {
			session,
		},
	});

	return result;
});
