import { error, fail } from "@sveltejs/kit";
import { QuestionsCategoryCreateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.categoryId === "nova") {
		return {
			title: "Nová kategorie otázek",
			description: "Vytvoření nové kategorie otázek",
			category: undefined,
		};
	}
	const category = await query.questionsCategories.findById({
		id: params.categoryId,
	});
	return {
		title: "Upravit kategorii otázek",
		description: "Upravit kategorii otázek",
		category,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(QuestionsCategoryCreateInput, request);

		if (issues) return fail(400, { issues });
		const { error: err } = await mutation.questionsCategories.create(output);
		if (err) {
			error(500, { message: "Nepodařilo se vytvořit kategorii otazek" });
		}

		return {
			success: true,
		};
	},
};
