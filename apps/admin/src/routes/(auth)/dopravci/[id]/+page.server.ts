import { fail } from "@sveltejs/kit";
import { PartnerCreateInput, PartnerUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.id === "novy") {
		return {
			partner: undefined,
		};
	}
	return {
		partner: await query.partners.findById({ id: params.id }),
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(PartnerCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { data: partner, error } = await mutation.partners.create(output);
		if (error) {
			return fail(500, { error: error.message });
		}
		return { success: true, id: partner.id };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PartnerUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { data: partner, error } = await mutation.partners.update({
			id: params.id,
			...output,
		});
		if (error) {
			return fail(500, { error: error.message });
		}
		return { success: true, id: partner.id };
	},
};
