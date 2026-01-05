import { fail } from "@sveltejs/kit";
import { UserUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	const { id } = params;
	return { user: await query.users.findById({ id }) };
};

export const actions = {
	default: async ({ request, params }) => {
		const { output, issues } = await validateRequest(UserUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await mutation.users.update({ ...output, id: params.id });
		if (error) {
			console.error(error);
			return fail(400, { message: "Nepodařilo se aktualizovat zákazníka" });
		}
		return { success: true };
	},
};
