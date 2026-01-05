import { query } from "$client";

export const load = async () => {
	const paymentMethods = await query.paymentMethods.findAll();

	return {
		paymentMethods,
	};
};
