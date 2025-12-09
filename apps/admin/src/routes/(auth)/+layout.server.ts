import { error } from "@sveltejs/kit";
import { client } from "$lib/client";

export const load = async () => {
	const [topPages, bottomPages] = await Promise.all([
		client.pages.top.get(),
		client.pages.bottom.get(),
	]);

	if (topPages.error || bottomPages.error) {
		throw error(500, "Failed to load pages");
	}

	return {
		topPages: topPages.data,
		bottomPages: bottomPages.data,
	};
};
