import { logger } from "@taxi/logger";
import { type ConnectionOptions, type Job, Queue, Worker } from "bullmq";
import { config } from "../config/config";

export abstract class BaseJob<
	TEvents extends Record<string, string>,
	TData = unknown,
> {
	protected readonly queue: Queue;
	protected readonly worker: Worker;
	private isShuttingDown = false;

	constructor(
		name: string,
		protected events: TEvents,
	) {
		logger.info(`Initializing ${name} queue and worker...`);
		const connection: ConnectionOptions = {
			host: config.REDIS_HOST,
			port: config.REDIS_PORT,
			password: config.REDIS_PASSWORD || undefined,
			maxRetriesPerRequest: null, // Required by BullMQ
			enableReadyCheck: true,
			enableOfflineQueue: false,
		};

		this.queue = new Queue(name, {
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

		this.worker = new Worker(
			name,
			async (job) => {
				try {
					await this.handleJob(job);
				} catch (error) {
					const err = error instanceof Error ? error : new Error(String(error));
					logger.error(`Error in job handler for ${job.name}: ${err.message}`);
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
			logger.info(`Job ${job.id} (${job.name}) completed successfully`);
		});

		this.worker.on("failed", (job, err) => {
			logger.error(
				`Job ${job?.id} (${job?.name}) failed: ${err.message} | Stack: ${err.stack}`,
			);
		});

		this.worker.on("error", (err) => {
			logger.error(
				`Worker error for ${name}: ${err.message} | Stack: ${err.stack}`,
			);
		});

		this.worker.on("closed", () => {
			logger.info(`Worker ${name} has been closed`);
		});

		logger.info(`${name} worker initialized successfully`);
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
		if (this.isShuttingDown) {
			logger.warn(
				`Cannot add job ${this.events[event]}: queue is shutting down`,
			);
			return;
		}

		try {
			logger.info(`Adding job ${this.events[event]} to queue...`);
			if (!this.events[event]) {
				logger.error(`Event ${String(event)} not found`);
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
			logger.info(`Added job ${this.events[event]} to queue (ID: ${job.id})`);
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			logger.error(`Failed to add job ${this.events[event]}: ${err.message}`);
			throw error;
		}
	}

	async close() {
		if (this.isShuttingDown) {
			logger.warn("Already shutting down");
			return;
		}

		this.isShuttingDown = true;
		logger.info("Gracefully closing worker and queue...");

		try {
			// Close worker first to stop accepting new jobs
			await this.worker.close();
			// Then close the queue
			await this.queue.close();
			logger.info("Worker and queue closed successfully");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			logger.error(`Error during close: ${err.message}`);
			throw error;
		}
	}
}
