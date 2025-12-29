import { fail } from "@sveltejs/kit";
import { client } from "$lib/orpc/client.server";
export const actions = {
	password: async ({ request }) => {
		const formData = await request.formData();
		const email = (formData.get("email") as string) || "";
		const password = (formData.get("password") as string) || "";
		const body = { email, password };
		const { data, error } = await client.auth.loginPassword(body);
		if (error) {
			return fail(400, { message: "Chybný email nebo heslo", email });
		}

		return data;
	},
	google: async ({ url }) => {
		const redirectUrl = `${url.origin}/`;
		const { data, error } = await client.auth.loginGoogle({ redirectUrl });
		if (error) {
			return fail(400, { message: "Chyba při přihlášení přes Google" });
		}
		return {
			authUrl: data.authUrl,
		};
	},
};
