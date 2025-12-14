import { json } from "@sveltejs/kit";
import { LoginEmailInput } from "@taxi/contracts/auth/auth.input";
import { safeParse } from "valibot";
import { auth } from "$lib/server/api.js";

export const POST = async ({ request }) => {
	const body = await request.json();
	const validated = safeParse(LoginEmailInput, body);
	if (!validated.success) {
		return json(
			{
				success: false,
				message: "Chyba ve formuláři",
				issues: validated.issues,
			},
			{ status: 400 },
		);
	}
	const { error } = await auth().login.email.post(validated.output);
	if (error) {
		return json(
			{ success: false, message: "Neplatné přihlášení" },
			{ status: 401 },
		);
	}
	return json({ success: true, message: "Přihlášení bylo úspěšné" });
};
