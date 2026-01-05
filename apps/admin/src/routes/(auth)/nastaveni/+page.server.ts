import { query } from "$client";

export const load = async () => {
	return {
		settings: await query.settings.findAll(),
	};
};
