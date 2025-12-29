import { error } from "@sveltejs/kit";
import { api } from "$lib/server/api";

export const load = async ({ params }) => {
	const { id } = params;
	const { data: quote, error: err } = await api().quotes({ id }).get();
	if (err) {
		error(404, "Quote not found");
	}
	return { quote };
};
