import { query } from "$client";

export const load = async () => {
	return {
		partners: await query.partners.findAll(),
	};
};
