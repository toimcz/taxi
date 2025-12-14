import {
	SendSmtpEmail,
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { logger } from "@taxi/logger";

export type Email = string & { __brand: "Email" };

interface Sender {
	name: string;
	email: Email;
}

interface To {
	email: Email;
	name?: string;
}

interface SendHtmlEmailOptions {
	sender: Sender;
	to: To[];
	subject: string;
	html: string;
}

interface SendTextEmailOptions {
	sender: Sender;
	to: To[];
	subject: string;
	text: string;
}

interface SendTemplateEmailOptions {
	sender: Sender;
	to: To[];
	subject: string;
	templateId: number;
	params: Record<string, string>;
}

export type SendEmailOptions =
	| SendHtmlEmailOptions
	| SendTextEmailOptions
	| SendTemplateEmailOptions;

export class BrevoClient {
	private readonly transactionalEmailsApi: TransactionalEmailsApi;

	constructor(apiKey: string) {
		// Create the TransactionalEmailsApi instance
		this.transactionalEmailsApi = new TransactionalEmailsApi();
		this.transactionalEmailsApi.setApiKey(
			TransactionalEmailsApiApiKeys.apiKey,
			apiKey,
		);
	}

	async sendEmail(options: SendEmailOptions): Promise<string[]> {
		try {
			const email = new SendSmtpEmail();
			email.sender = this.parseSender(options.sender);
			email.to = options.to.map((to) => this.parseTo(to));
			email.subject = options.subject;
			if ("html" in options) {
				email.htmlContent = options.html;
			} else if ("text" in options) {
				email.textContent = options.text;
			} else if ("templateId" in options) {
				email.templateId = options.templateId;
				email.params = options.params;
			}
			const { response, body } =
				await this.transactionalEmailsApi.sendTransacEmail(email);
			if (response?.statusCode && response.statusCode >= 300) {
				throw new Error("Error sending email");
			}
			return body.messageIds
				? body.messageIds
				: body.messageId
					? [body.messageId]
					: [];
		} catch (error) {
			logger.error("Error sending email");
			logger.error(error);
			throw new Error("Error sending email");
		}
	}

	private parseEmail(email: Email): Email {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email");
		}
		return email as Email;
	}

	private parseTo(to: To): To {
		return {
			email: this.parseEmail(to.email),
			name: to.name,
		};
	}

	private parseSender(sender: Sender): Sender {
		return {
			name: sender.name,
			email: this.parseEmail(sender.email),
		};
	}
}
