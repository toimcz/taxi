import { fail } from "@sveltejs/kit";
import { PageCreateInput, PageUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.id === "nova") {
		return {
			title: "Nová stránka",
			description: "Vytvořte novou stránku",
			page: undefined,
		};
	}
	const page = await query.pages.findById(params);
	return {
		title: "Editace stránky",
		description: "Upravte existující stránku",
		page,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(PageCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.pages.create(output);
		if (error) {
			return fail(500, { error });
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PageUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.pages.update({
			id: params.id,
			...output,
		});
		if (error) {
			return fail(500, { error });
		}
		return { success: true };
	},
};
