import { query } from "$client";

export const load = async ({ params }) => {
	const category = await query.postCategories.findBySlug({
		slug: params.category,
	});

	console.log(category);

	return {
		category,
	};
};
