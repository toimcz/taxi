import { query } from "$client";

export const load = async () => {
	return {
		emails: await query.emails.findLatest(),
	};
};
