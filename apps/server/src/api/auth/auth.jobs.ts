import type { User } from "@taxi/contracts/users/users.output";
import { logger } from "@taxi/logger";
import type { Job } from "bullmq";
import { BaseJob } from "src/common/job/base-job";

export const AUTH_JOBS = {
	WELCOME_EMAIL: "auth:welcome-email",
} as const;

export class AuthJobs extends BaseJob<typeof AUTH_JOBS, User> {
	static #instance: AuthJobs;
	private constructor() {
		super("AuthJobs", AUTH_JOBS);
	}

	static get instance(): AuthJobs {
		if (!AuthJobs.#instance) {
			AuthJobs.#instance = new AuthJobs();
		}
		return AuthJobs.#instance;
	}
	async handleJob(job: Job<User>): Promise<void> {
		switch (job.name) {
			case AUTH_JOBS.WELCOME_EMAIL:
				await this.welcomeEmail(job.data);
				break;
		}
	}

	private async welcomeEmail(user: User): Promise<void> {
		// TODO: Implement welcome email
		logger.info(
			`Sending welcome email to user ${user.email} with name ${user.name}`,
		);
	}
}
