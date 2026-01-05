import { fail } from "@sveltejs/kit";
import { DriverCreateInput, DriverUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	const { driverId } = params;
	if (driverId === "novy") {
		return { driver: undefined };
	}
	const driver = await query.drivers.findById({ id: params.driverId });
	return { driver };
};

export const actions = {
	create: async ({ request, params }) => {
		const { output, issues } = await validateRequest(DriverCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.drivers.create({
			...output,
			partnerId: params.id,
		});
		if (error) {
			return fail(500, { message: "Nepodařilo se vytvořit řidiče." });
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(DriverUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.drivers.update({
			...output,
			id: params.driverId,
			partnerId: params.id,
		});
		if (error) {
			return fail(500, { message: "Nepodařilo se upravit řidiče." });
		}
		return { success: true };
	},
};
