import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/api";

export const authHandler: Handle = async ({ event, resolve }) => {
	const { data: session, error } = await auth().session.get();
	if (!error && session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
		event.locals.isAuthenticated = !!session.user;
	}
	return resolve(event);
};
