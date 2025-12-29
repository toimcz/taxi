import { MeiliSearch as MeiliSearchClient, type RecordAny, type Settings } from "meilisearch";
import { Logger } from "../logger";

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

export class MeiliSearchService<T extends RecordAny[]> extends MeiliSearchClient {
	private readonly logger = new Logger("Meilisearch");
	constructor(private readonly options: MeiliSearchServiceOptions) {
		super({
			host: options.host,
			apiKey: options.apiKey,
		});
	}

	async init(data: T): Promise<void> {
		const { indexName } = this.options;

		// Delete existing index if it exists
		try {
			await this.getIndex(indexName);
			await this.deleteIndex(indexName);
			await this.waitForIndexNotExists(indexName);
		} catch {
			// Index does not exist, no action needed
		}

		// Create new index
		const index = await this.createIndex(indexName, {
			primaryKey: this.options.primaryKey,
		});
		if (!index) {
			this.logger.warn(`Failed to create MeiliSearch index ${indexName}`);
			return;
		}
		await this.waitForIndexExists(indexName);
		await this.configureIndexSettings();
		await this.addAll(data);
		this.logger.info(`MeiliSearch index ${indexName} initialized successfully`);
	}

	private async waitForIndexExists(uid: string, timeoutMs = 10_000): Promise<void> {
		const start = Date.now();
		while (Date.now() - start < timeoutMs) {
			try {
				await this.getIndex(uid);
				return;
			} catch {
				await new Promise((r) => setTimeout(r, 200));
			}
		}
		throw new Error(`Timeout waiting for MeiliSearch index ${uid} to be created`);
	}

	private async waitForIndexNotExists(uid: string, timeoutMs = 10_000): Promise<void> {
		const start = Date.now();
		while (Date.now() - start < timeoutMs) {
			try {
				await this.getIndex(uid);
				await new Promise((r) => setTimeout(r, 200));
			} catch {
				return;
			}
		}
		throw new Error(`Timeout waiting for MeiliSearch index ${uid} to be deleted`);
	}

	private async configureIndexSettings(): Promise<void> {
		try {
			const index = await this.getIndex(this.options.indexName);
			await index.updateSettings(this.options.settings);
		} catch (error) {
			this.logger.warn("Failed to configure index settings:");
			this.logger.warn(error);
		}
	}

	private async addAll(data: T): Promise<void> {
		try {
			this.logger.info("Adding all routes to MeiliSearch");
			if (!data.length) {
				this.logger.warn("No routes found to add to MeiliSearch");
				return;
			}
			// Process in batches for better performance with large datasets
			const batchSize = 1000;
			const batches = Math.ceil(data.length / batchSize);
			for (let i = 0; i < batches; i++) {
				const start = i * batchSize;
				const end = start + batchSize;
				const batch = data.slice(start, end);

				const index = await this.getIndex(this.options.indexName);
				await index.addDocuments(batch);
			}
			this.logger.info(`All added to MeiliSearch index ${this.options.indexName}`);
		} catch (error) {
			this.logger.error(`Failed to add all to MeiliSearch: ${this.options.indexName}`);
			this.logger.error(error);
		}
	}

	async addOne(item: T[number]): Promise<void> {
		try {
			const index = await this.getIndex(this.options.indexName);
			await index.addDocuments([item]);
		} catch (error) {
			this.logger.error("Failed to add item to MeiliSearch:");
			this.logger.error(error);
		}
	}

	async updateOne(item: T[number]): Promise<void> {
		try {
			const index = await this.getIndex(this.options.indexName);
			await index.updateDocuments([item]);
		} catch (error) {
			this.logger.error("Failed to update item in MeiliSearch:");
			this.logger.error(error);
		}
	}

	async deleteOne(id: string | number): Promise<void> {
		try {
			const index = await this.getIndex(this.options.indexName);
			await index.deleteDocument(id);
		} catch (error) {
			this.logger.error("Failed to delete item from MeiliSearch:");
			this.logger.error(error);
		}
	}

	async deleteAll(): Promise<void> {
		try {
			const index = await this.getIndex(this.options.indexName);
			await index.deleteAllDocuments();
		} catch (error) {
			this.logger.error("Failed to delete all items from MeiliSearch:");
			this.logger.error(error);
		}
	}

	async search(query: string): Promise<T> {
		try {
			const index = await this.getIndex(this.options.indexName);
			const searchResult = await index.search<T[number]>(query);
			return searchResult.hits as T;
		} catch (error) {
			this.logger.error("Failed to search MeiliSearch:");
			this.logger.error(error);
			return [] as unknown as T;
		}
	}
}
