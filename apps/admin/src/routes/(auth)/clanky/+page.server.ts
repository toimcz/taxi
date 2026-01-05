import { query } from "$client";

export const load = async () => {
	const data = await query.posts.findAll({ page: "1", limit: "30" });

	return {
		posts: data.data,
		meta: data.meta,
	};
};
