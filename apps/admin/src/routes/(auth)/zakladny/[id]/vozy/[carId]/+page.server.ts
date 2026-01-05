import { fail } from "@sveltejs/kit";
import { CarCreateInput, CarUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	if (params.carId === "novy") {
		return {
			car: undefined,
		};
	}
	return {
		car: await query.cars.findById({ id: params.carId }),
	};
};

export const actions = {
	create: async ({ request, params }) => {
		const { output, issues } = await validateRequest(CarCreateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await mutation.cars.create({
			...output,
			baseId: params.id,
		});
		if (error) {
			return fail(500, { message: "Failed to create car" });
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(CarUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		const { error } = await mutation.cars.update({
			...output,
			id: params.carId,
			baseId: params.id,
		});
		if (error) {
			return fail(500, { message: "Failed to create car" });
		}
		return { success: true };
	},
};
