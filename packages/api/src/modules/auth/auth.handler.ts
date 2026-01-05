import { implement, ORPCError } from "@orpc/server";
import { sign } from "@orpc/server/helpers";
import { authContract } from "@taxi/contracts";
import { config } from "../../config";
import { authGuard } from "../../guards/auth.guard";
import { authUseCases } from "./auth.use-cases";

const os = implement(authContract);

const loginPassword = os.loginPassword.handler(async ({ input }) => {
	const session = await authUseCases.loginPassword(input);
	return {
		message: "Login successful",
		cookie: {
			name: config.AUTH_COOKIE,
			value: await sign(session.session.sessionId, config.AUTH_SECRET),
			expires: new Date(session.session.expiresAt),
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
		},
	};
});

const loginEmail = os.loginEmail.handler(async ({ input }) => {
	await authUseCases.loginEmail(input);
	return { message: "Magic link sent if email exists" };
});

const loginGoogle = os.loginGoogle.handler(async ({ input }) => {
	return await authUseCases.loginGoogle(input.redirectUrl);
});

const googleCallback = os.callbackGoogle.handler(async ({ input }) => {
	const { session } = await authUseCases.googleCallback(input);

	return {
		message: "Login successful",
		cookie: {
			name: config.AUTH_COOKIE,
			value: await sign(session.sessionId, config.AUTH_SECRET),
			expires: new Date(session.expiresAt),
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
		},
	};
});

const registerPassword = os.registerPassword.handler(async ({ input }) => {
	await authUseCases.registerPassword(input);
	return { message: "Registration successful" };
});

const registerPasswordless = os.registerPasswordless.handler(async ({ input }) => {
	await authUseCases.registerPasswordless(input);
	return { message: "Registration successful" };
});

const me = os.me.use(authGuard).handler(async ({ context }) => {
	if (!context.session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	return context.session;
});

const logout = os.logout.use(authGuard).handler(async ({ context }) => {
	if (!context.session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	await authUseCases.logout(context.session.session.sessionId);
	return { message: "Logout successful" };
});

export const authHandler = {
	loginPassword,
	loginEmail,
	loginGoogle,
	googleCallback,
	registerPassword,
	registerPasswordless,
	me,
	logout,
};
