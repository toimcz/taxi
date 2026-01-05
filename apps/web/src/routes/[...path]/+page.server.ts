import { query } from "$client";

export const load = async ({ params }) => {
	const pathValues = params.path.split("/");
	const slug = pathValues[pathValues.length - 1];
	console.log(slug);
	const page = await query.pages.findBySlug({ slug });

	return {
		page,
	};
};
