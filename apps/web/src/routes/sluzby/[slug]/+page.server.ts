import { query } from "$client";

export const load = async ({ params }) => {
	const service = await query.services.findBySlug(params);

	return {
		service,
	};
};
