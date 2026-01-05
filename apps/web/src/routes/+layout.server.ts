import { query } from "$client";

export const load = async ({ locals }) => {
	const [topPages, bottomPages] = await Promise.all([
		query.pages.findTop(),
		query.pages.findBottom(),
	]);

	return {
		topPages: topPages,
		bottomPages: bottomPages,
		isAuthenticated: locals.isAuthenticated,
	};
};
