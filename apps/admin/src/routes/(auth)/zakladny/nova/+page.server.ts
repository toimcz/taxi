import { error, fail } from "@sveltejs/kit";
import { BaseCreateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { admin } from "$client";

export const load = async () => {
	const { data: countries, error: err } = await admin.countries.findAll();
	if (err) {
		error(500, "Nepodařilo se načíst země");
	}
	return { countries };
};

export const actions = {
	default: async ({ request }) => {
		const { output, issues } = await validateRequest(BaseCreateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error: err } = await admin.bases.create(output);
		if (err) {
			error(500, "Nepodařilo se vytvořit základnu");
		}

		return { success: true };
	},
};
