import { fail } from "@sveltejs/kit";
import { BaseUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	return { base: await query.bases.findById(params) };
};

export const actions = {
	default: async ({ request, params }) => {
		const id = params.id;
		if (!id) return fail(400, { message: "Chybí ID základny" });
		const { output, issues } = await validateRequest(BaseUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await mutation.bases.update({
			id,
			...output,
		});
		if (error) {
			return fail(500, { message: "Nepodařilo se aktualizovat základnu" });
		}
		return { success: true };
	},
};
