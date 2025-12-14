import type { SendEmailOptions } from "@taxi/brevo";
import type { Job } from "bullmq";
import { EmailService } from "src/api/emails/email.service";
import { BaseJob } from "src/common/job/base-job";

export const MAIL_JOBS = {
	SEND_EMAIL: "mail:send-email",
} as const;

export class MailJob extends BaseJob<typeof MAIL_JOBS, SendEmailOptions> {
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

	async handleJob(job: Job<SendEmailOptions>): Promise<void> {
		switch (job.name) {
			case MAIL_JOBS.SEND_EMAIL:
				await this.sendEmail(job.data);
				break;
		}
	}

	async sendEmail(options: SendEmailOptions): Promise<void> {
		await EmailService.instance.sendEmail(options);
	}
}
