import { type ConnectionOptions, type Job, Queue, Worker } from "bullmq";
import { config } from "../../config/config";
import { Logger } from "../logger";

export abstract class BaseJob<TEvents extends Record<string, string>, TData = unknown> {
	private readonly logger = new Logger("base-job");
	protected queue!: Queue;
	protected worker!: Worker;
	private isShuttingDown = false;
	private initialized = false;

	constructor(
		private readonly name: string,
		protected events: TEvents,
	) {
		this.logger.info(`Creating ${name} job (deferred initialization)...`);
		// Initialize asynchronously after constructor to avoid blocking
		setImmediate(() => this.initializeQueue());
	}

	private async initializeQueue(): Promise<void> {
		if (this.initialized) return;
		this.initialized = true;

		try {
			this.logger.info(`Initializing ${this.name} queue and worker...`);
			const connection: ConnectionOptions = {
				host: config.REDIS_HOST,
				port: config.REDIS_PORT,
				password: config.REDIS_PASSWORD || undefined,
				maxRetriesPerRequest: null, // Required by BullMQ
				enableReadyCheck: false, // Disable ready check to avoid blocking startup
				enableOfflineQueue: true, // Enable offline queue so jobs can be queued even if Redis is down
				connectTimeout: 5000, // 5 second connection timeout
				retryStrategy: (times) => {
					// Exponential backoff with max delay
					const delay = Math.min(times * 100, 2000);
					return delay;
				},
			};

			this.queue = new Queue(this.name, {
				connection,
				defaultJobOptions: {
					removeOnComplete: {
						count: 100,
						age: 3600, // Keep completed jobs for 1 hour
					},
					removeOnFail: {
						count: 500,
						age: 86400, // Keep failed jobs for 24 hours
					},
					attempts: 3,
					backoff: {
						type: "exponential",
						delay: 1000,
					},
				},
			});

			// Create worker - connection is non-blocking with enableOfflineQueue and enableReadyCheck: false
			this.worker = new Worker(
				this.name,
				async (job) => {
					try {
						await this.handleJob(job);
					} catch (error) {
						const err = error instanceof Error ? error : new Error(String(error));
						this.logger.error(`Error in job handler for ${job.name}: ${err.message}`);
						throw error; // Re-throw to let BullMQ handle retries
					}
				},
				{
					connection,
					concurrency: 5,
					lockDuration: 30000, // 30 seconds
				},
			);

			this.worker.on("completed", (job) => {
				this.logger.info(`Job ${job.id} (${job.name}) completed successfully`);
			});

			this.worker.on("failed", (job, err) => {
				this.logger.error(
					`Job ${job?.id} (${job?.name}) failed: ${err.message} | Stack: ${err.stack}`,
				);
			});

			this.worker.on("error", (err) => {
				// Log but don't throw - allow server to continue running
				// Worker will automatically retry connection with retryStrategy
				this.logger.warn(
					`Worker error for ${this.name}: ${err.message}. Worker will retry connection.`,
				);
			});

			this.worker.on("closed", () => {
				this.logger.info(`Worker ${this.name} has been closed`);
			});

			this.logger.info(`${this.name} worker initialized (connecting to Redis asynchronously)`);
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(`Failed to initialize ${this.name}: ${err.message}`);
		}
	}

	protected abstract handleJob(job: Job<TData>): Promise<void>;

	async add(
		event: keyof TEvents,
		data: TData,
		options?: {
			delay?: number;
			priority?: number;
			type?: string;
			attempts?: number;
		},
	) {
		// Wait for queue to be initialized if not yet
		if (!this.initialized) {
			await new Promise((resolve) => {
				const checkInterval = setInterval(() => {
					if (this.initialized) {
						clearInterval(checkInterval);
						resolve(undefined);
					}
				}, 50);
			});
		}

		if (this.isShuttingDown) {
			this.logger.warn(`Cannot add job ${this.events[event]}: queue is shutting down`);
			return;
		}

		try {
			this.logger.info(`Adding job ${this.events[event]} to queue...`);
			if (!this.events[event]) {
				this.logger.error(`Event ${String(event)} not found`);
				return;
			}
			const job = await this.queue.add(this.events[event], data, {
				delay: options?.delay ?? 2000,
				priority: options?.priority,
				attempts: options?.attempts ?? 3,
				backoff: {
					type: "exponential",
					delay: 5000,
				},
			});
			this.logger.info(`Added job ${this.events[event]} to queue (ID: ${job.id})`);
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(`Failed to add job ${this.events[event]}: ${err.message}`);
			throw error;
		}
	}

	async close() {
		if (this.isShuttingDown) {
			this.logger.warn("Already shutting down");
			return;
		}

		this.isShuttingDown = true;
		this.logger.info("Gracefully closing worker and queue...");

		try {
			// Close worker first to stop accepting new jobs
			await this.worker.close();
			// Then close the queue
			await this.queue.close();
			this.logger.info("Worker and queue closed successfully");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(`Error during close: ${err.message}`);
			throw error;
		}
	}
}
