import { fail } from "@sveltejs/kit";
import { CountryCreateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation } from "$client";

export const actions = {
	default: async ({ request }) => {
		const { output, issues } = await validateRequest(CountryCreateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await mutation.countries.create(output);
		if (error) {
			return fail(500, error.message);
		}
		return { success: true };
	},
};
