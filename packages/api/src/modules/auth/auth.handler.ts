import { implement, ORPCError } from "@orpc/server";
import { setCookie, sign } from "@orpc/server/helpers";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import { authContract } from "@taxi/contracts";
import { config } from "../../config";
import type { Context } from "../../context";
import { Logger } from "../../lib/logger";
import { authUseCases } from "./auth.use-cases";

type ORPCContext = ResponseHeadersPluginContext & Context;

const logger = new Logger("AuthHandler");
const os = implement(authContract).$context<ORPCContext>();

const loginPassword = os.loginPassword.handler(async ({ input }) => {
	logger.info("Login attempt for user:", input.email);
	const session = await authUseCases.loginPassword(input);
	const headers = new Headers();
	setCookie(
		headers,
		config.AUTH_COOKIE,
		await sign(session.session.sessionId, config.AUTH_SECRET),
		{
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			expires: new Date(session.session.expiresAt),
		},
	);
	return {
		message: "Login successful",
		headers,
	};
});

const loginEmail = os.loginEmail.handler(async ({ input }) => {
	await authUseCases.loginEmail(input);
	return { message: "Magic link sent if email exists" };
});

const loginGoogle = os.loginGoogle.handler(async ({ input }) => {
	const authUrl = await authUseCases.loginGoogle(input.redirectUrl);
	return {
		authUrl,
	};
});

const googleCallback = os.callbackGoogle.handler(async ({ input }) => {
	const { session, redirectUrl } = await authUseCases.googleCallback(input);
	const headers = new Headers();

	setCookie(
		headers,
		config.AUTH_COOKIE,
		await sign(session.session.sessionId, config.AUTH_SECRET),
		{
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			expires: new Date(session.session.expiresAt),
		},
	);

	return {
		headers,
		redirectUrl,
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

const me = os.me.handler(async ({ context }) => {
	if (!context.sessionId) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	const session = await authUseCases.me(context.sessionId);
	if (!session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	return session;
});

const logout = os.logout.handler(async ({ context }) => {
	if (!context.sessionId) {
		throw new ORPCError("UNAUTHORIZED", { message: "Invalid session" });
	}
	await authUseCases.logout(context.sessionId);
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
