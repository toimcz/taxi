import {
	type Index,
	MeiliSearch as MeiliSearchClient,
	type RecordAny,
	type Settings,
} from "meilisearch";
import { config } from "../../config/config";
import { Logger } from "../logger";
import { text } from "../text";

export class MeiliSearch extends MeiliSearchClient {
	private readonly logger = new Logger("meilisearch-service");
	async checkMeiliSearchHealth() {
		try {
			const health = await this.health();
			if (health.status === "available") {
				this.logger.info("MeiliSearch is healthy and available");
			} else {
				this.logger.error(`MeiliSearch is not available: ${JSON.stringify(health)}`);
				process.exit(1);
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(`Failed to connect to MeiliSearch: ${err.message}`);
			process.exit(1);
		}
	}
}

interface MeiliSearchServiceOptions {
	host: string;
	apiKey: string;
	indexName: string;
	primaryKey: string;
	settings: Settings;
}

const INDEX_PREFIX = text.slug(config.APP_NAME);

export class MeiliSearchService<T extends RecordAny[]> extends MeiliSearchClient {
	private readonly logger = new Logger("Meilisearch");
	private indexCache: Index<T[number]> | null = null;
	private readonly prefixedIndexName: string;

	constructor(private readonly options: MeiliSearchServiceOptions) {
		super({
			host: options.host,
			apiKey: options.apiKey,
		});
		this.prefixedIndexName = `${INDEX_PREFIX}_${options.indexName}`;
	}

	private getIndexInstance(): Index<T[number]> {
		if (!this.indexCache) {
			this.indexCache = this.index<T[number]>(this.prefixedIndexName);
		}
		return this.indexCache;
	}

	async init(data: T): Promise<void> {
		// Delete existing index if it exists
		try {
			await this.getIndex(this.prefixedIndexName);
			await this.deleteIndex(this.prefixedIndexName).waitTask();
		} catch {
			// Index does not exist, no action needed
		}

		// Create new index and wait for task to complete
		await this.createIndex(this.prefixedIndexName, {
			primaryKey: this.options.primaryKey,
		}).waitTask();

		// Clear index cache after recreation
		this.indexCache = null;

		await this.configureIndexSettings();
		await this.addAll(data);
		this.logger.info(`MeiliSearch index ${this.prefixedIndexName} initialized successfully`);
	}

	private async configureIndexSettings(): Promise<void> {
		try {
			const index = this.getIndexInstance();
			await index.updateSettings(this.options.settings).waitTask();
		} catch (error) {
			this.logger.warn("Failed to configure index settings:");
			this.logger.warn(error);
		}
	}

	private async addAll(data: T): Promise<void> {
		try {
			this.logger.info("Adding all documents to MeiliSearch");
			if (!data.length) {
				this.logger.warn("No documents found to add to MeiliSearch");
				return;
			}

			const index = this.getIndexInstance();
			const batchSize = 1000;

			for (let i = 0; i < data.length; i += batchSize) {
				const batch = data.slice(i, i + batchSize);
				await index.addDocuments(batch).waitTask();
			}

			this.logger.info(`All documents added to MeiliSearch index ${this.prefixedIndexName}`);
		} catch (error) {
			this.logger.error(`Failed to add documents to MeiliSearch: ${this.prefixedIndexName}`);
			this.logger.error(error);
		}
	}

	async addOne(item: T[number]): Promise<void> {
		try {
			const index = this.getIndexInstance();
			await index.addDocuments([item]).waitTask();
		} catch (error) {
			this.logger.error("Failed to add item to MeiliSearch:");
			this.logger.error(error);
		}
	}

	async updateOne(item: T[number]): Promise<void> {
		try {
			const index = this.getIndexInstance();
			await index.updateDocuments([item]).waitTask();
		} catch (error) {
			this.logger.error("Failed to update item in MeiliSearch:");
			this.logger.error(error);
		}
	}

	async deleteOne(id: string | number): Promise<void> {
		try {
			const index = this.getIndexInstance();
			await index.deleteDocument(id).waitTask();
		} catch (error) {
			this.logger.error("Failed to delete item from MeiliSearch:");
			this.logger.error(error);
		}
	}

	async deleteAll(): Promise<void> {
		try {
			const index = this.getIndexInstance();
			await index.deleteAllDocuments().waitTask();
		} catch (error) {
			this.logger.error("Failed to delete all items from MeiliSearch:");
			this.logger.error(error);
		}
	}

	async search(query: string): Promise<T> {
		try {
			const index = this.getIndexInstance();
			const searchResult = await index.search(query);
			return searchResult.hits as T;
		} catch (error) {
			this.logger.error("Failed to search MeiliSearch:");
			this.logger.error(error);
			return [] as unknown as T;
		}
	}
}
