import type { Job } from "bullmq";
import type { SendEmailOptions } from "../../lib/brevo";
import { BaseJob } from "../../lib/job";
import { emailUseCases } from "./email.use-cases";

export const MAIL_JOBS = {
	SEND_EMAIL: "mail:send-email",
} as const;

interface SendEmailJobData {
	email: SendEmailOptions;
	createdById: string;
}

export class MailJob extends BaseJob<typeof MAIL_JOBS, SendEmailJobData> {
	static #instance: MailJob;
	private constructor() {
		super("MailJob", MAIL_JOBS);
	}

	static get instance(): MailJob {
		if (!MailJob.#instance) {
			MailJob.#instance = new MailJob();
		}
		return MailJob.#instance;
	}

	async handleJob(job: Job<SendEmailJobData>): Promise<void> {
		switch (job.name) {
			case MAIL_JOBS.SEND_EMAIL:
				await this.sendEmail(job.data.email, job.data.createdById);
				break;
		}
	}

	async sendEmail(email: SendEmailOptions, createdById: string): Promise<void> {
		await emailUseCases.sendEmail(email, createdById);
	}
}
