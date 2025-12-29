import type { Handle } from "@sveltejs/kit";
import { COOKIE_NAME } from "$env/static/private";
import { auth } from "$lib/orpc/client.server";

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
	return resolve(event);
};
