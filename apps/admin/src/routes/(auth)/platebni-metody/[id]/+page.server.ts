import { fail } from "@sveltejs/kit";
import {
	PaymentMethodCreateInput,
	PaymentMethodProvider,
	PaymentMethodUpdateInput,
} from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params }) => {
	const providers = Object.keys(PaymentMethodProvider).map((k) => k.toLowerCase());
	if (params.id === "nova") {
		return {
			title: "Nová platební metoda",
			description: "Vytvořte novou platební metodu pro vaši aplikaci.",
			paymentMethod: undefined,
			providers,
		};
	}
	const paymentMethod = await query.paymentMethods.findById(params);

	return {
		title: "Upravit platební metodu",
		description: "Upravte nastavení platební metody pro vaši aplikaci.",
		paymentMethod,
		providers,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(PaymentMethodCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error: err } = await mutation.paymentMethods.create(output);
		if (err) {
			return fail(500, err.message);
		}
		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PaymentMethodUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error: err } = await mutation.paymentMethods.update({
			id: params.id,
			...output,
		});
		if (err) {
			return fail(500, err.message);
		}
		return { success: true };
	},
};
