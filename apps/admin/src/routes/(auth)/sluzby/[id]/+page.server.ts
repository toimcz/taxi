import { error, fail } from "@sveltejs/kit";
import { ServiceCreateInput, ServiceUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.id === "nova") {
		return {
			service: null,
		};
	}
	const service = await query.services.findById(params);

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
		const { data: service, error: err } = await mutation.services.create(output);
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
		const { data: service, error: err } = await mutation.services.update(output);
		if (err) {
			error(500, "Nepodařilo se aktualizovat službu");
		}
		return {
			service,
		};
	},
};
