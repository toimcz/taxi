import { error, fail } from "@sveltejs/kit";
import { CountryUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	const country = await query.countries.findById(params);

	return {
		country,
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const { output, issues } = await validateRequest(CountryUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}

		const { error: err } = await mutation.countries.update({
			id: params.id,
			...output,
		});
		if (err) {
			error(500, "Failed to update country");
		}

		return { success: true };
	},
};
