import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server";

export const load = async () => {
	const { data: categories, error: err } = await admin.questionsCategories.findAll();
	if (err) {
		error(500, { message: "Nepodařilo se načíst kategorie otazek" });
	}
	return {
		categories,
	};
};
