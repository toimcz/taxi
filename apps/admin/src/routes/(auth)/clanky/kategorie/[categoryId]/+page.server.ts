import { fail } from "@sveltejs/kit";
import { PostCategoryCreateInput, PostCategoryUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.categoryId === "nova") {
		return {
			title: "Nová kategorie",
			description: "Nová kategorie článků",
			category: undefined,
		};
	}
	const category = await query.postCategories.findById({ id: params.categoryId });
	return {
		title: "Editace kategorie",
		description: "Úprava kategorie článků",
		category,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(PostCategoryCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.postCategories.create(output);
		console.log(output, error);
		if (error) {
			return fail(500, { error });
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PostCategoryUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.postCategories.update({
			id: params.categoryId,
			...output,
		});
		if (error) {
			return fail(500, { error });
		}
		return { success: true };
	},
};
