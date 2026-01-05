import { error } from "@sveltejs/kit";
import { PaginationParamsInput } from "@taxi/contracts";
import { validateQuery } from "@taxi/shared";
import { query } from "$client";

export const load = async ({ url }) => {
	const { output, issues } = validateQuery(PaginationParamsInput, url);
	if (issues) {
		error(400, "Invalid query parameters");
	}
	return {
		bases: await query.bases.findAll(output),
	};
};
