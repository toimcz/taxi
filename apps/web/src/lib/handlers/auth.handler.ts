import type { Handle } from "@sveltejs/kit";
import { auth } from "$client";
import { COOKIE_NAME } from "$env/static/private";

export const authHandler: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(COOKIE_NAME);
	if (!sessionId) {
		return resolve(event);
	}
	const { data: session, error: err } = await auth.me();
	if (err) {
		return resolve(event);
	}
	event.locals.session = session.session;
	event.locals.user = session.user;
	event.locals.isAuthenticated = !!session;
	return resolve(event);
};
