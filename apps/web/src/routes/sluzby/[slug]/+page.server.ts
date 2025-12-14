import { error } from "@sveltejs/kit";
import { api } from "$lib/server/api";

export const load = async ({ params }) => {
	const service = await api().services.findBySlug({ slug: params.slug }).get();
	if (service.error) {
		error(404, "Service not found");
	}

	return {
		service: service.data,
	};
};
