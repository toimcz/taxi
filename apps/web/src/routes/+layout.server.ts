import { error } from "@sveltejs/kit";
import { api } from "$lib/server/api.js";

export const load = async ({ locals }) => {
	const [topPages, bottomPages] = await Promise.all([
		api().pages.top.get(),
		api().pages.bottom.get(),
	]);

	if (topPages.error || bottomPages.error) {
		throw error(500, "Failed to load pages");
	}

	return {
		topPages: topPages.data,
		bottomPages: bottomPages.data,
		isAuthenticated: locals.isAuthenticated,
	};
};
