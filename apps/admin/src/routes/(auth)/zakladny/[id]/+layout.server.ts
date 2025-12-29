import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server.js";

export const load = async ({ params }) => {
	const { data: base, error: err } = await admin.bases.findById({ id: params.id });
	if (err) {
		error(500, "Nepodařilo se načíst základnu");
	}
	return {
		base,
	};
};
