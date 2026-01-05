import { fail } from "@sveltejs/kit";
import { LoginEmailInput, LoginPasswordInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { auth } from "$client";
import { GOOGLE_CALLBACK_REDIRECT_URL, GOOGLE_STATE_COOKIE_NAME } from "$env/static/private";

export const actions = {
	password: async ({ request }) => {
		const { issues, output } = await validateRequest(LoginPasswordInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await auth.loginPassword(output);
		if (error) {
			return fail(400, { message: error.message });
		}
		return {
			success: true,
			message: "Přihlášení bylo úspěšné",
		};
	},
	email: async ({ request }) => {
		const { issues, output } = await validateRequest(LoginEmailInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await auth.loginEmail(output);
		if (error) {
			return fail(400, { message: error.message });
		}
		return {
			success: true,
			message: "Odkaz pro přihlášení byl odeslán na váš e-mail",
		};
	},
	google: async ({ cookies }) => {
		const { data, error } = await auth.loginGoogle({ redirectUrl: GOOGLE_CALLBACK_REDIRECT_URL });
		console.log({ data, error });
		if (error) {
			return fail(400, { message: error.message });
		}
		cookies.set(GOOGLE_STATE_COOKIE_NAME, data.state, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			maxAge: 300, // 5 minutes
		});
		return {
			url: data.url,
			success: true,
		};
	},
};
