import { query } from "$client";

export const load = async ({ params }) => {
	const post = await query.posts.findBySlug({
		categoryslug: params.category,
		postslug: params.post,
	});

	return {
		post,
	};
};
