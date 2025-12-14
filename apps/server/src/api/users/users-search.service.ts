import type { UserItem } from "@taxi/contracts/users/users.output";
import { logger } from "@taxi/logger";
import { findAllUsers } from "src/api/users/users.prepare";
import { config } from "src/common/config/config";
import { MeiliSearchService } from "src/modules/meilisearch.service";

export class UsersSearchService extends MeiliSearchService<UserItem[]> {
	static #instance: UsersSearchService;

	private constructor() {
		super({
			host: config.MEILISEARCH_HOST,
			apiKey: config.MEILISEARCH_KEY,
			indexName: "users",
			primaryKey: "id",
			settings: {
				searchableAttributes: ["name", "note", "email", "phone", "role"],
				filterableAttributes: ["name", "note", "email", "phone", "role"],
			},
		});
	}

	static get instance(): UsersSearchService {
		if (!UsersSearchService.#instance) {
		}
		return UsersSearchService.#instance;
	}

	async init() {
		logger.info("Initializing Users Search Index...");
		const usersData = await findAllUsers.execute();
		logger.info(`Found ${usersData.length} users`);
		await super.init(usersData);
		logger.info("Users Search Index initialized successfully");
	}
}
