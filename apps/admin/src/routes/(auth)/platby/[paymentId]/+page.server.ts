import { fail } from "@sveltejs/kit";
import { PaymentUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	const [payment, paymentMethods] = await Promise.all([
		query.payments.findById({ id: params.paymentId }),
		query.paymentMethods.findAllActive(),
	]);

	return {
		payment,
		paymentMethods,
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PaymentUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.payments.update({
			paymentId: params.paymentId,
			...output,
		});
		if (error) {
			return fail(500, "Nepodařilo se aktualizovat platbu");
		}
		return { success: true };
	},
};
