import { fail, redirect } from "@sveltejs/kit";
import { QuoteCreateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { api } from "$lib/server/api";

export const actions = {
	default: async ({ request }) => {
		const { issues, output } = await validateRequest(QuoteCreateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { data, error } = await api().quotes.post(output);
		if (error) {
			return fail(error.status, { message: error.value.message });
		}
		redirect(302, `/kalkulace/${data.id}`);
	},
};
