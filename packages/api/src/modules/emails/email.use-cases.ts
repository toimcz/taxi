import { type Email, EmailStatus } from "@taxi/contracts";
import { db, type EmailSelect, emails$ } from "@taxi/db";
import { config } from "../../config";
import { BrevoClient, BrevoError, type SendEmailOptions } from "../../lib/brevo";
import { Logger } from "../../lib/logger";

const logger = new Logger("EmailService");
const brevoClient = new BrevoClient(config.BREVO_API_KEY);

const findAll = async (): Promise<Email[]> => {
	const emails = await db.query.emails$.findMany();
	return emails.map(mapToEmail);
};

/**
 * Send email via Brevo and track in database
 *
 * @param options - Email options (sender, recipients, content)
 * @param createdById - ID of user sending the email
 * @throws Error if email sending fails
 */
const sendEmail = async (options: SendEmailOptions, createdById: string): Promise<void> => {
	try {
		// Send email via Brevo (includes retry logic)
		const messageIds = await brevoClient.sendEmail(options);

		if (!messageIds.length) {
			throw new Error("No message IDs returned from Brevo");
		}

		// Track sent emails in database
		const emailsToInsert = messageIds.map((messageId, index) => {
			const to = options.to[index];
			if (!to) {
				throw new Error(`Missing recipient at index ${index}`);
			}

			return {
				providerId: messageId,
				email: to.email,
				subject: options.subject,
				status: EmailStatus.SENT,
				createdById,
			};
		});

		await db.insert(emails$).values(emailsToInsert).onConflictDoNothing();

		logger.info({
			message: "Email sent and tracked successfully",
			messageIds,
			recipients: options.to.length,
			subject: options.subject,
		});
	} catch (error) {
		// Log detailed error server-side
		if (error instanceof BrevoError) {
			logger.error({
				message: "Brevo error sending email",
				statusCode: error.statusCode,
				context: error.context,
				error: error.message,
			});
		} else if (error instanceof Error) {
			logger.error({
				message: "Error sending email",
				error: error.message,
				stack: error.stack,
			});
		} else {
			logger.error({
				message: "Unknown error sending email",
				error: String(error),
			});
		}

		// Return generic error to caller (don't leak internal details)
		throw new Error("Failed to send email. Please try again later.");
	}
};

function mapToEmail(email: EmailSelect): Email {
	return {
		...email,
		createdAt: email.createdAt.toISOString(),
		updatedAt: email.updatedAt.toISOString(),
	};
}
export const emailUseCases = {
	findAll,
	sendEmail,
};
