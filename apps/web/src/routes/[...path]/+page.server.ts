import { error } from "@sveltejs/kit";
import { client } from "$lib/client";

export const load = async ({ params }) => {
	const pathValues = params.path.split("/");
	const page = await client.pages.findBySlug({ slug: pathValues[0] }).get();
	if (page.error) {
		error(404, "Page not found");
	}
	return {
		page: page.data,
	};
};
