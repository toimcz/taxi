import { error } from "@sveltejs/kit";
import { ParamUUID } from "@taxi/contracts/common";
import { UserSearchInput } from "@taxi/contracts/users/users.input";
import type { User, Users } from "@taxi/contracts/users/users.output";
import { sleep } from "@taxi/utils";
import { query } from "$app/server";
import { api } from "$lib/server/api";

export const findAllUsers = query(async () => {
	const { data, error: err } = await api().users.get({
		query: {
			limit: "100",
			page: "1",
		},
	});

	if (err) {
		error(500, "Failed to get users");
	}

	return data;
});

export const usersSearch = query(
	UserSearchInput,
	async (input): Promise<Users> => {
		const empty = {
			users: [],
			meta: {
				total: 0,
				page: 1,
				limit: 100,
				totalPages: 1,
			},
		};
		if (input.query.length < 2) {
			const { data, error: err } = await api().users.get({
				query: {
					limit: "100",
					page: "1",
				},
			});

			if (err) {
				console.log(err);
				return empty;
			}

			return data;
		}

		const { data, error: err } = await api().users.search.get({
			query: input,
		});
		if (err) {
			console.log(err);
			return empty;
		}

		return {
			users: data,
			meta: {
				total: data.length,
				page: 1,
				limit: data.length,
				totalPages: Math.ceil(data.length / (data.length || 1)),
			},
		};
	},
);

export const findUserById = query(ParamUUID, async (input): Promise<User> => {
	await sleep(3000);
	const { data, error: err } = await api().users.findById(input).get();
	if (err) {
		error(500, "Failed to get user");
	}
	return data;
});
