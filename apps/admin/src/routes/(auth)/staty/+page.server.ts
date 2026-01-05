import { query } from "$client";

export const load = async () => {
	const countries = await query.countries.findAll();

	return {
		countries,
	};
};
