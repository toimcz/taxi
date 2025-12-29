import { fail } from "@sveltejs/kit";
import { CarCreateInput, CarUpdateInput } from "@taxi/contracts";
import { validateRequest } from "$lib/server/validate-request";

export const load = async ({ params }) => {
	if (params.carId === "novy") {
		return {
			car: undefined,
		};
	}
	return {
		car: undefined,
	};
};

export const actions = {
	default: async ({ request, params }) => {
		if (params.carId === "novy") {
			const { output, issues, idempotencyKey } = await validateRequest(CarCreateInput, request);
			if (issues) {
				return fail(400, issues);
			}
			return { success: true };
		}
		const { output, issues, idempotencyKey } = await validateRequest(CarUpdateInput, request);
		if (issues) {
			return fail(400, issues);
		}
		return { success: true };
	},
};
