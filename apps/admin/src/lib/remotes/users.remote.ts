import { error } from "@sveltejs/kit";
import { PaginationParamsInput, ParamUUID, type User, UsersSearchInput } from "@taxi/contracts";
import { query } from "$app/server";
import { admin } from "$lib/orpc/client.server";

export const findAllUsers = query(PaginationParamsInput, async (input) => {
	const { data, error: err } = await admin.users.findAll(input);

	if (err) {
		error(500, "Failed to get users");
	}

	return data;
});

export const usersSearch = query(UsersSearchInput, async (input) => {
	const empty = {
		data: [],
		meta: {
			total: 0,
			page: 1,
			limit: 100,
			totalPages: 1,
		},
	};
	if (input.query.length < 2) {
		const { data, error } = await admin.users.findAll({
			page: "1",
			limit: "50",
		});

		if (error) {
			console.log(error);
			return empty;
		}

		return data;
	}

	const { data, error: err } = await admin.users.search(input);
	if (err) {
		console.log(err);
		return empty;
	}

	return data;
});

export const findUserById = query(ParamUUID, async (input): Promise<User> => {
	const { data, error: err } = await admin.users.findById(input);
	if (err) {
		error(500, "Failed to get user");
	}
	return data;
});
