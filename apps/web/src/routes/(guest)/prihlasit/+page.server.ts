import { fail } from "@sveltejs/kit";
import { LoginPasswordInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/utils";
import { auth } from "$lib/server/api";

export const actions = {
	loginPassword: async ({ request }) => {
		const { issues, output } = await validateRequest(LoginPasswordInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await auth().login.password.post(output);
		if (error) {
			return fail(error.status, { message: error.value.message });
		}
		return {
			success: true,
			message: "Přihlášení bylo úspěšné",
		};
	},
};
