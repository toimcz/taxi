import { query } from "$client";

export const load = async () => {
	return {
		categories: await query.postCategories.findAll(),
	};
};
