import { fail } from "@sveltejs/kit";
import { BaseUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/utils";
import { admin } from "$lib/orpc/client.server";

export const load = async ({ parent, locals }) => {
	const { base } = await parent();
	return {
		base,
		auth: locals.user,
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const id = params.id;
		if (!id) return fail(400, { message: "Chybí ID základny" });
		const { output, issues } = await validateRequest(BaseUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await admin.bases.update({
			id,
			...output,
		});
		if (error) {
			return fail(500, { message: "Nepodařilo se aktualizovat základnu" });
		}
		return { success: true };
	},
};
