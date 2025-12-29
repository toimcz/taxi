import type { IdentitySelect } from "@taxi/db";
import type { Job } from "bullmq";
import { config } from "../../config";
import type { Email } from "../../lib/brevo";
import { BaseJob } from "../../lib/job";
import { emailUseCases } from "../emails";
import type { MagicLink } from "./magic-links.use-cases";

interface MagicLinkJobData {
	identity: IdentitySelect;
	magicLink: MagicLink;
}

export const MAGIC_LINKS_JOBS = {
	SEND_MAGIC_LINK: "magic-links:send-magic-link",
} as const;

export class MagicLinksJobs extends BaseJob<typeof MAGIC_LINKS_JOBS, MagicLinkJobData> {
	constructor() {
		super("MagicLinksJobs", MAGIC_LINKS_JOBS);
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
		await emailUseCases.sendEmail(
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
