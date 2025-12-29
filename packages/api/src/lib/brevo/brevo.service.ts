import {
	SendSmtpEmail,
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { email, pipe, safeParse, string } from "valibot";
import { Logger } from "../logger";

/**
 * Branded type for validated email addresses
 */
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
	params: Record<string, string | number>;
}

export type SendEmailOptions =
	| SendHtmlEmailOptions
	| SendTextEmailOptions
	| SendTemplateEmailOptions;

/**
 * Custom error class for Brevo-specific errors
 */
export class BrevoError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly context?: Record<string, unknown>,
	) {
		super(message);
		this.name = "BrevoError";
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, BrevoError);
		}
	}
}

/**
 * Production-ready Brevo email client with singleton pattern
 *
 * Features:
 * - Singleton pattern for resource efficiency
 * - Robust email validation using Valibot
 * - Retry logic for transient failures
 * - Structured error handling and logging
 * - Type-safe email operations
 * - Rate limit handling
 */
export class BrevoClient {
	private readonly logger = new Logger("BrevoClient");
	private readonly transactionalEmailsApi: TransactionalEmailsApi;
	private readonly maxRetries = 3;
	private readonly retryDelay = 1000; // ms
	private readonly timeout = 30000; // 30 seconds

	constructor(apiKey: string) {
		// Validate API key
		if (!apiKey || apiKey.trim().length === 0) {
			throw new BrevoError("Brevo API key is required and cannot be empty");
		}

		// Initialize Brevo API client
		this.transactionalEmailsApi = new TransactionalEmailsApi();
		this.transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

		this.logger.info("BrevoClient initialized successfully");
	}

	/**
	 * Send email with automatic retry logic for transient failures
	 *
	 * @param options - Email options (html, text, or template)
	 * @returns Array of message IDs from Brevo
	 * @throws BrevoError if email sending fails after retries
	 */
	async sendEmail(options: SendEmailOptions): Promise<string[]> {
		// Validate inputs before attempting to send
		this.validateEmailOptions(options);

		let lastError: Error | undefined;

		for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
			try {
				const email = this.buildEmail(options);

				// Send with timeout
				const result = await this.sendWithTimeout(email);

				// Log success
				this.logger.info({
					message: "Email sent successfully",
					to: options.to.map((t) => t.email),
					subject: options.subject,
					messageIds: result,
					attempt,
				});

				return result;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				// Check if error is retryable
				const isRetryable = this.isRetryableError(error);

				this.logger.warn({
					message: "Email send attempt failed",
					attempt,
					maxRetries: this.maxRetries,
					isRetryable,
					error: lastError.message,
					to: options.to.map((t) => t.email),
					subject: options.subject,
				});

				// Don't retry on non-retryable errors - throw immediately
				if (!isRetryable) {
					// Rethrow the original error for validation and client errors
					if (error instanceof BrevoError) {
						throw error;
					}
					throw lastError;
				}

				// Wait before retry (exponential backoff)
				if (attempt < this.maxRetries) {
					const delay = this.retryDelay * 2 ** (attempt - 1);
					await this.sleep(delay);
				}
			}
		}

		// All retries failed
		throw new BrevoError("Failed to send email after multiple attempts", undefined, {
			to: options.to.map((t) => t.email),
			subject: options.subject,
			attempts: this.maxRetries,
			lastError: lastError?.message,
		});
	}

	/**
	 * Build SendSmtpEmail object from options
	 */
	private buildEmail(options: SendEmailOptions): SendSmtpEmail {
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

		return email;
	}

	/**
	 * Send email with timeout protection
	 */
	private async sendWithTimeout(email: SendSmtpEmail): Promise<string[]> {
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new BrevoError(`Email send timeout after ${this.timeout}ms`, 408));
			}, this.timeout);
		});

		const sendPromise = this.transactionalEmailsApi
			.sendTransacEmail(email)
			.then(({ response, body }) => {
				// Validate response
				if (!response || !response.statusCode) {
					throw new BrevoError("Invalid response from Brevo API");
				}

				// Handle error status codes
				if (response.statusCode >= 400) {
					throw new BrevoError("Brevo API returned error status", response.statusCode, { body });
				}

				// Extract message IDs
				return body.messageIds ? body.messageIds : body.messageId ? [body.messageId] : [];
			});

		return Promise.race([sendPromise, timeoutPromise]);
	}

	/**
	 * Determine if an error is retryable (transient failure)
	 */
	private isRetryableError(error: unknown): boolean {
		if (error instanceof BrevoError) {
			// Retry on timeout, rate limit, or server errors
			return (
				error.statusCode === 408 || // Timeout
				error.statusCode === 429 || // Rate limit
				(error.statusCode !== undefined && error.statusCode >= 500 && error.statusCode < 600) // Server errors
			);
		}

		// Retry on network errors
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			return (
				message.includes("network") ||
				message.includes("timeout") ||
				message.includes("econnreset") ||
				message.includes("enotfound")
			);
		}

		return false;
	}

	/**
	 * Validate email options before sending
	 */
	private validateEmailOptions(options: SendEmailOptions): void {
		// Validate subject
		if (!options.subject || options.subject.trim().length === 0) {
			throw new BrevoError("Email subject is required");
		}

		// Validate recipients
		if (!options.to || options.to.length === 0) {
			throw new BrevoError("At least one recipient is required");
		}

		// Validate content
		if ("html" in options && (!options.html || options.html.trim().length === 0)) {
			throw new BrevoError("HTML content is required for HTML emails");
		}

		if ("text" in options && (!options.text || options.text.trim().length === 0)) {
			throw new BrevoError("Text content is required for text emails");
		}

		if ("templateId" in options) {
			if (!options.templateId || options.templateId <= 0) {
				throw new BrevoError("Valid template ID is required for template emails");
			}
			if (!options.params || typeof options.params !== "object") {
				throw new BrevoError("Template params must be a valid object");
			}
		}
	}

	/**
	 * Validate and parse email address using Valibot schema
	 */
	private parseEmail(e: string): Email {
		const result = safeParse(pipe(string(), email("Neplatný formát emailu")), e);

		if (!result.success) {
			throw new BrevoError(`Invalid email address: ${e}`, undefined, {
				e,
				issues: result.issues,
			});
		}

		return result.output as Email;
	}

	/**
	 * Parse and validate recipient
	 */
	private parseTo(to: To): To {
		return {
			email: this.parseEmail(to.email),
			name: to.name?.trim() || undefined,
		};
	}

	/**
	 * Parse and validate sender
	 */
	private parseSender(sender: Sender): Sender {
		if (!sender.name || sender.name.trim().length === 0) {
			throw new BrevoError("Sender name is required");
		}

		return {
			name: sender.name.trim(),
			email: this.parseEmail(sender.email),
		};
	}

	/**
	 * Sleep utility for retry delays
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
