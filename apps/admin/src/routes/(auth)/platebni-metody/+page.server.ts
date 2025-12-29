import { error } from "@sveltejs/kit";
import { admin } from "$lib/orpc/client.server";

export const load = async () => {
	const { data: paymentMethods, error: err } = await admin.paymentMethods.findAll();
	if (err) {
		error(500, err.message);
	}

	return {
		paymentMethods,
	};
};
