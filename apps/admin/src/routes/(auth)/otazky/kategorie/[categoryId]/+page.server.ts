import { error, fail } from "@sveltejs/kit";
import { QuestionsCategoryCreateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/utils";
import { admin } from "$lib/orpc/client.server";

export const load = async ({ params }) => {
	if (params.categoryId === "nova") {
		return {
			title: "Nová kategorie otázek",
			description: "Vytvoření nové kategorie otázek",
			questionCategory: undefined,
		};
	}
	const { data: questionCategory, error: err } = await admin.questionsCategories.findById({
		id: params.categoryId,
	});
	if (err) {
		error(500, { message: "Nepodařilo se načíst kategorii otazek" });
	}
	return {
		title: "Upravit kategorii otázek",
		description: "Upravit kategorii otázek",
		questionCategory,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(QuestionsCategoryCreateInput, request);

		if (issues) return fail(400, { issues });
		const { error: err } = await admin.questionsCategories.create(output);
		if (err) {
			error(500, { message: "Nepodařilo se vytvořit kategorii otazek" });
		}

		return {
			success: true,
		};
	},
};
