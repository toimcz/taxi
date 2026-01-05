import { error, redirect } from "@sveltejs/kit";
import { auth } from "$client";
import {
	COOKIE_NAME,
	GOOGLE_CALLBACK_REDIRECT_URL,
	GOOGLE_STATE_COOKIE_NAME,
} from "$env/static/private";

export const GET = async ({ cookies, url }) => {
	const stateValue = cookies.get(GOOGLE_STATE_COOKIE_NAME);
	if (!stateValue) error(400, "Missing state");

	const state = url.searchParams.get("state");
	if (!state) error(400, "Missing state");

	if (state !== stateValue) error(400, "Invalid state");

	const code = url.searchParams.get("code");
	if (!code) error(400, "Missing code");

	const { data, error: err } = await auth.callbackGoogle({
		redirectUrl: GOOGLE_CALLBACK_REDIRECT_URL,
		state,
		code,
	});

	if (err) error(500, err);

	cookies.set(COOKIE_NAME, data.cookie.value, {
		path: "/",
		sameSite: "lax",
		httpOnly: true,
		secure: true,
		expires: new Date(data.cookie.expires),
	});

	cookies.delete(GOOGLE_STATE_COOKIE_NAME, { path: "/" });

	redirect(302, "/");
};
