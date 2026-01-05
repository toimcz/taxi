import { query } from "$client";

export const load = async ({ params }) => {
	return {
		partner: await query.partners.findById(params),
	};
};
