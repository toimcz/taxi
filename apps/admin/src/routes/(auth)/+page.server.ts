import { redirect } from "@sveltejs/kit";
import { client } from "$client";
import { COOKIE_NAME } from "$env/static/private";

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
