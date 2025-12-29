import { error, fail } from "@sveltejs/kit";
import { QuestionCreateInput, QuestionUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/utils";
import { admin } from "$lib/orpc/client.server";

export const load = async ({ params }) => {
	if (params.id === "nova") {
		return {
			question: undefined,
		};
	}
	const { data: question, error: err } = await admin.questions.findById({ id: params.id });

	if (err) {
		error(500, { message: "Nepodařilo se načíst otázku" });
	}
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
		const { error: err } = await admin.questions.create(output);
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
		const { error: err } = await admin.questions.update({
			id: params.id,
			...output,
		});
		if (err) {
			error(500, { message: "Nepodařilo se aktualizovat otázku" });
		}
		return { success: true };
	},
};
