import { error } from "@sveltejs/kit";
import { PaginationParamsInput } from "@taxi/contracts";
import { admin } from "$lib/orpc/client.server.js";
import { validateQuery } from "$lib/server/validate-request";

export const load = async ({ locals, url }) => {
	const { output, issues } = await validateQuery(PaginationParamsInput, url);
	if (issues) {
		error(400, {
			message: "Neplatné parametry dotazu",
			cause: issues,
		});
	}
	const { data: bases, error: err } = await admin.bases.findAll(output);
	if (err) {
		error(500, {
			message: err.message,
			cause: err.cause,
		});
	}
	return {
		bases,
		auth: locals.user,
	};
};
