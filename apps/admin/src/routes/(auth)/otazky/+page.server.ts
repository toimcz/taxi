import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server";

export const load = async () => {
	const { data: questions, error: err } = await admin.questions.findAll();
	if (err) {
		error(500, err.message);
	}
	return {
		questions,
	};
};
