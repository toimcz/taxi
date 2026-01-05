import { query } from "$client";

export const load = async () => {
	return {
		pages: await query.pages.findAll(),
	};
};
