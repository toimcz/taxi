import type { UserItem } from "@taxi/contracts";
import { db } from "@taxi/db";
import { config } from "../../config";
import { MeiliSearchService } from "../../lib/meilisearch";

class UsersSearchService extends MeiliSearchService<UserItem[]> {
	constructor() {
		super({
			host: config.MEILISEARCH_HOST,
			apiKey: config.MEILISEARCH_KEY,
			indexName: "users",
			primaryKey: "id",
			settings: {
				searchableAttributes: ["name", "note", "email", "phone", "roles"],
				filterableAttributes: ["name", "note", "email", "phone", "roles"],
			},
		});
	}

	async init() {
		const usersData = await db.query.users$.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				phone: true,
				roles: true,
				note: true,
				lastLoginAt: true,
			},
		});
		await super.init(usersData);
	}
}

export const usersSearch = new UsersSearchService();
await usersSearch.init();
