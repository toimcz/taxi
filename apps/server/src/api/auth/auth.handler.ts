import {
	GoogleCallbackInput,
	GoogleLoginInput,
	LoginEmailInput,
	LoginPasswordInput,
	MagicLinkInput,
	RegisterPasswordInput,
	RegisterPasswordlessInput,
} from "@taxi/contracts/auth/auth.input";
import {
	ConflictResponse,
	InternalServerErrorResponse,
	SuccessResponse,
	UnauthorizedResponse,
} from "@taxi/contracts/common";
import { Session } from "@taxi/contracts/sessions/session";
import { logger } from "@taxi/logger";
import Elysia from "elysia";
import { AuthService } from "src/api/auth/auth.service";
import { IdentitiesService } from "src/api/auth/identities.service";
import { SessionsService } from "src/api/sessions/sessions.service";
import { config } from "src/common/config/config";
import { ConflictError } from "src/common/errors";
import { object, string } from "valibot";

export const authHandler = new Elysia({
	prefix: "/auth",
	name: "auth",
})
	.decorate("authService", AuthService.instance)
	.decorate("sessionsService", SessionsService.instance)
	.decorate("identitiesService", IdentitiesService.instance)
	.get(
		"/session",
		async ({ authService, cookie, status }) => {
			const cookieValue = cookie[config.AUTH_COOKIE]?.value as string;
			if (!cookieValue) {
				throw status(401, {
					status: 401,
					message: "Unauthorized",
				});
			}
			const session = await authService.getSession(cookieValue);
			if (!session) {
				throw status(401, {
					status: 401,
					message: "Unauthorized",
				});
			}
			return session;
		},
		{
			response: {
				200: Session,
				401: UnauthorizedResponse,
			},
		},
	)
	.post(
		"/logout",
		async ({ cookie, status, set, authService }) => {
			const cookieValue = cookie[config.AUTH_COOKIE]?.value as string;
			if (!cookieValue) {
				throw status(401, {
					status: 401,
					message: "Unauthorized",
				});
			}
			try {
				await authService.logout(cookieValue);
				// Delete the cookie by setting it with maxAge: 0 and matching attributes
				const authCookie = cookie[config.AUTH_COOKIE];
				if (authCookie) {
					authCookie.set({
						value: "",
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						path: "/",
						maxAge: 0,
						expires: new Date(0),
					});
				} else {
					// Fallback: set cookie with maxAge: 0 to delete it
					set.cookie = {
						[config.AUTH_COOKIE]: {
							value: "",
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							path: "/",
							maxAge: 0,
							expires: new Date(0),
						},
					};
				}
				return {
					success: true,
					message: "Odhlášení bylo úspěšné",
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Interní chyba serveru";
				logger.error(errorMessage);
				throw status(401, {
					status: 401,
					message: errorMessage,
				});
			}
		},
		{
			response: {
				200: SuccessResponse,
				401: UnauthorizedResponse,
			},
		},
	)
	.post(
		"/login/password",
		async ({ body, status, cookie, set, authService }) => {
			try {
				const session = await authService.loginPassword(body);

				// set cookie
				const authCookie = cookie[config.AUTH_COOKIE];
				if (authCookie) {
					authCookie.set({
						value: session.session.sessionId,
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						path: "/",
						expires: new Date(session.session.expiresAt),
					});
				} else {
					set.cookie = {
						[config.AUTH_COOKIE]: {
							value: session.session.sessionId,
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							path: "/",
							expires: new Date(session.session.expiresAt),
						},
					};
				}

				return {
					success: true,
					message: "Přihlášení bylo úspěšné",
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Interní chyba serveru";
				throw status(401, {
					status: 401,
					message: errorMessage,
				});
			}
		},
		{
			body: LoginPasswordInput,
			response: {
				200: SuccessResponse,
				401: UnauthorizedResponse,
			},
		},
	)
	.post(
		"/login/email",
		async ({ body, status, authService }) => {
			try {
				await authService.loginEmail(body);
				return {
					success: true,
					message: "Email sent",
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Interní chyba serveru";
				logger.error(errorMessage);
				throw status(401, {
					status: 401,
					message: errorMessage,
				});
			}
		},
		{
			body: LoginEmailInput,
			response: {
				200: SuccessResponse,
				401: UnauthorizedResponse,
			},
		},
	)
	.get(
		"/google",
		async ({ query, authService }) => {
			const authorizationURL = await authService.generateGoogleAuthorizationURL(
				query.redirectUrl,
			);
			return {
				authorizationURL: authorizationURL.toString(),
			};
		},
		{
			query: GoogleLoginInput,
			response: {
				200: object({
					authorizationURL: string(),
				}),
				401: UnauthorizedResponse,
			},
		},
	)
	.get(
		"/callback/google",
		async ({ query, cookie, set, status, redirect, authService }) => {
			try {
				const { session, redirectUrl } = await authService.callbackGoogle(
					query.code,
					query.state,
				);

				// Set session cookie
				const authCookie = cookie[config.AUTH_COOKIE];
				if (authCookie) {
					authCookie.set({
						value: session.session.sessionId,
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						path: "/",
						maxAge: Math.floor(
							(new Date(session.session.expiresAt).getTime() - Date.now()) /
								1000,
						),
					});
				} else {
					set.cookie = {
						[config.AUTH_COOKIE]: {
							value: session.session.sessionId,
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							path: "/",
							maxAge: Math.floor(
								(new Date(session.session.expiresAt).getTime() - Date.now()) /
									1000,
							),
						},
					};
				}
				return redirect(redirectUrl, 302);
			} catch (error) {
				if (error && typeof error === "object" && "status" in error) {
					throw error;
				}
				logger.error(
					`Google callback error: ${error instanceof Error ? error.message : String(error)}`,
				);
				throw status(401, {
					status: 401,
					message: "Interní chyba serveru",
				});
			}
		},
		{
			query: GoogleCallbackInput,
			response: {
				401: UnauthorizedResponse,
			},
		},
	)
	.post(
		"/magiclink",
		async ({ body, status, cookie, set, authService }) => {
			try {
				const session = await authService.validateMagicLink(body.token);
				const authCookie = cookie[config.AUTH_COOKIE];
				if (authCookie) {
					authCookie.set({
						value: session.session.sessionId,
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						path: "/",
						maxAge: Math.floor(
							(new Date(session.session.expiresAt).getTime() - Date.now()) /
								1000,
						),
					});
				} else {
					set.cookie = {
						[config.AUTH_COOKIE]: {
							value: session.session.sessionId,
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							path: "/",
							maxAge: Math.floor(
								(new Date(session.session.expiresAt).getTime() - Date.now()) /
									1000,
							),
						},
					};
				}
				return {
					success: true,
					message: "Magic link validated",
				};
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Interní chyba serveru";
				logger.error(errorMessage);
				throw status(401, {
					status: 401,
					message: errorMessage,
				});
			}
		},
		{
			body: MagicLinkInput,
			response: {
				200: SuccessResponse,
				401: UnauthorizedResponse,
			},
		},
	)
	.post(
		"/register/password",
		async ({ body, cookie, set, authService, status }) => {
			try {
				const session = await authService.registerPassword(body);
				const authCookie = cookie[config.AUTH_COOKIE];
				if (authCookie) {
					authCookie.set({
						value: session.session.sessionId,
						httpOnly: true,
						secure: true,
						sameSite: "lax",
						path: "/",
						maxAge: Math.floor(
							(new Date(session.session.expiresAt).getTime() - Date.now()) /
								1000,
						),
					});
				} else {
					set.cookie = {
						[config.AUTH_COOKIE]: {
							value: session.session.sessionId,
							httpOnly: true,
							secure: true,
							sameSite: "lax",
							path: "/",
							maxAge: Math.floor(
								(new Date(session.session.expiresAt).getTime() - Date.now()) /
									1000,
							),
						},
					};
				}
				return {
					success: true,
					message: "Registrace byla úspěšná",
				};
			} catch (error) {
				if (error instanceof ConflictError) {
					throw status(409, {
						status: 409,
						message: error.message,
					});
				}
				const errorMessage =
					error instanceof Error ? error.message : "Interní chyba serveru";
				logger.error(errorMessage);
				throw status(500, {
					status: 500,
					message: errorMessage,
				});
			}
		},
		{
			body: RegisterPasswordInput,
			response: {
				200: SuccessResponse,
				409: ConflictResponse,
				500: InternalServerErrorResponse,
			},
		},
	)
	.post(
		"/register/passwordless",
		async ({ body, status, authService }) => {
			try {
				await authService.registerPasswordless(body);
				return {
					success: true,
					message: "Registrace byla úspěšná",
				};
			} catch (error) {
				if (error instanceof ConflictError) {
					throw status(409, {
						status: 409,
						message: error.message,
					});
				}
				logger.error(error instanceof Error ? error.message : String(error));
				throw status(500, {
					status: 500,
					message: "Interní chyba serveru",
				});
			}
		},
		{
			body: RegisterPasswordlessInput,
			response: {
				200: SuccessResponse,
				409: ConflictResponse,
				500: InternalServerErrorResponse,
			},
		},
	);
