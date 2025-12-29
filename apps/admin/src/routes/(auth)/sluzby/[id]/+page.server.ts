import { error, fail } from "@sveltejs/kit";
import { ServiceCreateInput, ServiceUpdateInput } from "@taxi/contracts";
import { admin } from "$lib/orpc/client.server.js";
import { validateRequest } from "$lib/server/validate-request.js";

export const load = async ({ params }) => {
	if (params.id === "nova") {
		return {
			service: null,
		};
	}
	const { data: service, error: err } = await admin.services.findById(params);
	if (err) {
		error(404, "Služba nenalezena");
	}
	return {
		service,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(ServiceCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { data: service, error: err } = await admin.services.create(output);
		if (err) {
			error(500, "Nepodařilo se vytvořit službu");
		}
		return {
			service,
		};
	},
	update: async ({ request }) => {
		const { output, issues } = await validateRequest(ServiceUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { data: service, error: err } = await admin.services.update(output);
		if (err) {
			error(500, "Nepodařilo se aktualizovat službu");
		}
		return {
			service,
		};
	},
};
