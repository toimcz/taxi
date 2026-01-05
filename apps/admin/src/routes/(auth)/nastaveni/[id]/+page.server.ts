import { fail } from "@sveltejs/kit";
import { SettingCreateInput, SettingUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params, locals }) => {
	if (params.id === "nove") {
		return {
			setting: null,
			user: locals.user,
		};
	}

	const setting = await query.settings.findById(params);
	return {
		setting,
		user: locals.user,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(SettingCreateInput, request);
		if (issues) return fail(400, { issues });

		const { error } = await mutation.settings.create(output);
		if (error) return fail(500, { error });

		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(SettingUpdateInput, request);
		if (issues) return fail(400, { issues });

		const { error } = await mutation.settings.update({
			id: params.id,
			...output,
		});
		if (error) return fail(500, { error });

		return { success: true };
	},
};
