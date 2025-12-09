import { error } from "@sveltejs/kit";
import { client } from "$lib/client";
export const load = async ({ params }) => {
	const service = await client.services.findBySlug({ slug: params.slug }).get();
	if (service.error) {
		error(404, "Service not found");
	}

	return {
		service: service.data,
	};
};
