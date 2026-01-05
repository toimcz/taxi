import { query } from "$client";

export const load = async () => {
	const payments = await query.payments.findLatest();

	return {
		payments,
	};
};
