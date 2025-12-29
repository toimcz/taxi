import { fail } from "@sveltejs/kit";
import { CountryCreateInput } from "@taxi/contracts";
import { admin } from "$lib/orpc/client.server.js";
import { validateRequest } from "$lib/server/validate-request";

export const actions = {
	default: async ({ request }) => {
		const { output, issues } = await validateRequest(CountryCreateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await admin.countries.create(output);
		if (error) {
			return fail(500, error.message);
		}
		return { success: true };
	},
};
