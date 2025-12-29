import { error, fail } from "@sveltejs/kit";
import { CountryUpdateInput } from "@taxi/contracts";
import { admin } from "$lib/orpc/client.server";
import { validateRequest } from "$lib/server/validate-request";

export const load = async ({ params }) => {
	const { data: country, error: err } = await admin.countries.findById(params);
	if (err) {
		error(500, "Failed to load country");
	}
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

		const { error: err } = await admin.countries.update({
			id: params.id,
			...output,
		});
		if (err) {
			error(500, "Failed to update country");
		}

		return { success: true };
	},
};
