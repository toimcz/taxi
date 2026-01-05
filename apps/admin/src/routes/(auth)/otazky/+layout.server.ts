import { query } from "$client";

export const load = async () => {
	const categories = await query.questionsCategories.findAll();
	return {
		categories,
	};
};
