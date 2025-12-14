import { Elysia } from "elysia";
import { SessionsService } from "src/api/sessions/sessions.service";
import { config } from "src/common/config/config";

export const sessionsMiddleware = new Elysia({
	name: "sessions-middleware",
	cookie: {
		sign: [config.AUTH_COOKIE],
	},
}).resolve({ as: "global" }, async ({ cookie }) => {
	const cookieValue = cookie[config.AUTH_COOKIE]?.value as string;
	if (!cookieValue) {
		return {
			session: null,
			user: null,
		};
	}
	const session = await SessionsService.instance.getSession(cookieValue);
	if (!session) {
		return {
			session: null,
			user: null,
		};
	}
	return {
		session: session.session,
		user: session.user,
	};
});
