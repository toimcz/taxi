import { ORPCError, os } from "@orpc/server";
import { Role } from "@taxi/contracts";
import type { AppContext } from "../context";
import { authUseCases } from "../modules/auth";

export const adminGuard = os.$context<AppContext>().middleware(async ({ context, next }) => {
	if (!context.sessionId) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	const session = await authUseCases.me(context.sessionId);

	if (!session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}

	const userRoles = session.user.roles;
	const requiredRoles = Object.values(Role).filter((r) => r !== Role.USER);
	const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

	if (!hasRequiredRole) {
		throw new ORPCError("FORBIDDEN", { message: "Insufficient permissions" });
	}

	const result = await next({
		context: {
			session,
		},
	});

	return result;
});
