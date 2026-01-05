import { fail } from "@sveltejs/kit";
import { LoginPasswordInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { auth } from "$client";
import {
	COOKIE_NAME,
	GOOGLE_CALLBACK_REDIRECT_URL,
	GOOGLE_STATE_COOKIE_NAME,
} from "$env/static/private";
export const actions = {
	password: async ({ request, cookies }) => {
		const { output, issues } = await validateRequest(LoginPasswordInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { data, error } = await auth.loginPassword(output);

		if (error) {
			return fail(400, { message: "Chybný email nebo heslo", email: output.email });
		}

		cookies.set(COOKIE_NAME, data.cookie.value, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			expires: new Date(data.cookie.expires),
		});

		return {
			message: data.message,
		};
	},
	google: async ({ cookies }) => {
		const { data, error } = await auth.loginGoogle({ redirectUrl: GOOGLE_CALLBACK_REDIRECT_URL });
		if (error) {
			return fail(400, { message: "Chyba při přihlášení přes Google" });
		}
		cookies.set(GOOGLE_STATE_COOKIE_NAME, data.state, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			expires: new Date(Date.now() + 5 * 60 * 1000),
		});
		return {
			authUrl: data.url,
		};
	},
};
