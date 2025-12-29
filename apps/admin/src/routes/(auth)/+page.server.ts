import { redirect } from "@sveltejs/kit";
import { COOKIE_NAME } from "$env/static/private";
import { client } from "$lib/orpc/client.server";

export const actions = {
	logout: async ({ cookies }) => {
		const sessionId = cookies.get(COOKIE_NAME);

		if (sessionId) {
			await client.auth.logout({ sessionId });
		}

		cookies.set(COOKIE_NAME, "", {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			expires: new Date(0),
			maxAge: 0,
		});

		redirect(302, "/prihlasit");
	},
};
