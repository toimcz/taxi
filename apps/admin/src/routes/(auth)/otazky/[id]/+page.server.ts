import { error, fail } from "@sveltejs/kit";
import { QuestionCreateInput, QuestionUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.id === "nova") {
		return {
			question: undefined,
		};
	}
	const question = await query.questions.findById({ id: params.id });

	return {
		question,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(QuestionCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error: err } = await mutation.questions.create(output);
		if (err) {
			error(500, { message: "Nepodařilo se vytvořit otázku" });
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(QuestionUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error: err } = await mutation.questions.update({
			id: params.id,
			...output,
		});
		if (err) {
			error(500, { message: "Nepodařilo se aktualizovat otázku" });
		}
		return { success: true };
	},
};
