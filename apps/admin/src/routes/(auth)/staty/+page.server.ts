import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server";

export const load = async () => {
	const { data: countries, error: err } = await admin.countries.findAll();
	if (err) {
		error(500, "Failed to load countries");
	}
	return {
		countries,
	};
};
