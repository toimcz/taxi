import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server";

export const load = async () => {
	const { data: services, error: err } = await admin.services.findAll();
	if (err) {
		error(500, err.message);
	}
	return {
		services,
	};
};
