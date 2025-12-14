import type { Email } from "@taxi/brevo";
import type { IdentitySelect } from "@taxi/db/schemas/auth";
import type { Job } from "bullmq";
import { EmailService } from "src/api/emails/email.service";
import type { MagicLink } from "src/api/magic-links/magic-links.service";
import { config } from "src/common/config/config";
import { BaseJob } from "src/common/job/base-job";

interface MagicLinkJobData {
	identity: IdentitySelect;
	magicLink: MagicLink;
}

export const MAGIC_LINKS_JOBS = {
	SEND_MAGIC_LINK: "magic-links:send-magic-link",
} as const;

export class MagicLinksJobs extends BaseJob<
	typeof MAGIC_LINKS_JOBS,
	MagicLinkJobData
> {
	static #instance: MagicLinksJobs;
	private constructor(private readonly emailService: EmailService) {
		super("MagicLinksJobs", MAGIC_LINKS_JOBS);
	}

	static get instance(): MagicLinksJobs {
		if (!MagicLinksJobs.#instance) {
			MagicLinksJobs.#instance = new MagicLinksJobs(EmailService.instance);
		}
		return MagicLinksJobs.#instance;
	}

	async handleJob(job: Job<MagicLinkJobData>): Promise<void> {
		switch (job.name) {
			case MAGIC_LINKS_JOBS.SEND_MAGIC_LINK:
				await this.sendMagicLink(job.data);
				break;
		}
	}

	async sendMagicLink(data: MagicLinkJobData): Promise<void> {
		const link = await this.generateMagicLink(data.magicLink);
		await this.emailService.sendEmail(
			{
				sender: {
					name: config.NODE_ENV === "production" ? config.APP_NAME : "Test App",
					email:
						config.NODE_ENV === "production"
							? (config.APP_EMAIL as Email)
							: ("info@myeurotaxi.com" as Email),
				},
				to: [{ email: data.identity.providerId as Email }],
				subject: `Váš odkaz na přihlášení na webu ${config.APP_NAME}`,
				templateId: 15,
				params: {
					link,
				},
			},
			data.identity.userId,
		);
	}

	private async generateMagicLink(magicLink: MagicLink): Promise<string> {
		return `${magicLink.redirectUrl}/prihlasit/${magicLink.id}`;
	}
}
