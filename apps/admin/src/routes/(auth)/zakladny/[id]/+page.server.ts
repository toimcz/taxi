import { query } from "$client";

export const load = async ({ params }) => {
	return { base: await query.bases.findById(params) };
};
