import { query } from "$client";

export const load = async () => {
	const questions = await query.questions.findAll();
	return {
		questions,
	};
};
