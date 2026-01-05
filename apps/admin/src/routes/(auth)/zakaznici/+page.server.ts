import type { ApiData, UserItem } from "@taxi/contracts";
import { query } from "$client";

export const load = async ({ url, locals }) => {
	const searchQuery = url.searchParams.get("q") || "";
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "50";

	let users: ApiData<UserItem[]>;
	if (searchQuery.length >= 2) {
		users = await query.users.search({ query: searchQuery });
	} else {
		users = await query.users.findAll({ page, limit });
	}

	return {
		users,
		searchQuery,
		auth: locals.user,
	};
};
