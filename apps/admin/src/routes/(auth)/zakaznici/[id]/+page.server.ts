import { error, fail } from "@sveltejs/kit";
import { UserUpdateInput } from "@taxi/contracts";
import { omit } from "valibot";
import { admin } from "$lib/orpc/client.server.js";
import { validateRequest } from "$lib/server/validate-request";

export const load = async ({ params }) => {
	const { id } = params;
	const { data: user, error: err } = await admin.users.findById({ id });
	if (err) {
		console.error(err);
		error(500, "Nepodařilo se načíst zákazníka");
	}
	console.log(user);
	return { user };
};

export const actions = {
	default: async ({ request, params }) => {
		const { output, issues } = await validateRequest(omit(UserUpdateInput, ["id"]), request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await admin.users.update({ ...output, id: params.id });
		if (error) {
			console.error(error);
			return fail(400, { message: "Nepodařilo se aktualizovat zákazníka" });
		}
		return { success: true };
	},
};
