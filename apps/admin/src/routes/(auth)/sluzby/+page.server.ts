import { query } from "$client";

export const load = async () => {
	const services = await query.services.findAll();
	return {
		services,
	};
};
