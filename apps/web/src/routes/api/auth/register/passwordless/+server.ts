import { json } from "@sveltejs/kit";
import { RegisterPasswordlessInput } from "@taxi/contracts";
import { safeParse } from "valibot";
import { auth } from "$lib/server/api.js";

export const POST = async ({ request }) => {
	const body = await request.json();
	const validated = safeParse(RegisterPasswordlessInput, body);
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
	const { data, error } = await auth().register.passwordless.post(validated.output);
	if (error) {
		if (error.status === 409) {
			return json({ success: false, message: "Uživatel již existuje" }, { status: 409 });
		}
		return json({ success: false, message: "Chyba při registraci" }, { status: 500 });
	}
	return json({ success: true, message: data.message });
};
