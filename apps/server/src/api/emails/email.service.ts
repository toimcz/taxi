import { BrevoClient, type SendEmailOptions } from "@taxi/brevo";
import { EmailStatus } from "@taxi/contracts/common";
import { type Database, db } from "@taxi/db";
import { emails$ } from "@taxi/db/schemas/emails";
import { logger } from "@taxi/logger";
import { config } from "src/common/config/config";

export class EmailService {
	private readonly db: Database;
	static #instance: EmailService;

	private constructor(private readonly brevoClient: BrevoClient) {
		this.db = db;
	}

	static get instance(): EmailService {
		if (!EmailService.#instance) {
			EmailService.#instance = new EmailService(
				new BrevoClient(config.BREVO_API_KEY),
			);
		}
		return EmailService.#instance;
	}

	async sendEmail(
		options: SendEmailOptions,
		createdById: string,
	): Promise<void> {
		try {
			const messageIds = await this.brevoClient.sendEmail(options);
			console.log(messageIds);
			if (!messageIds.length) {
				throw new Error("Error sending email");
			}

			const emailsToInsert = messageIds.map((messageId, index) => {
				const to = options.to[index];
				return {
					providerId: messageId,
					email: to?.email ?? "",
					subject: options.subject,
					status: EmailStatus.SENT,
					createdById,
				};
			});
			await this.db
				.insert(emails$)
				.values(emailsToInsert)
				.onConflictDoNothing();
		} catch (error) {
			logger.error("Error sending email");
			logger.error(error);
			throw new Error("Error sending email");
		}
	}
}
