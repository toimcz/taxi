import pino from "pino";
import { config } from "../../config";

export class Logger {
	private readonly console: pino.Logger;
	constructor(private readonly name: string) {
		this.console = pino({
			level: config.NODE_ENV === "development" ? "debug" : "error",
			...(config.NODE_ENV === "production" && {
				formatters: {
					level: (label) => ({ level: label }),
				},
				// Reduce overhead by disabling some features
				timestamp: pino.stdTimeFunctions.isoTime,
				// Only include essential fields
				base: {
					env: config.NODE_ENV,
				},
			}),
			// Development optimizations
			...(config.NODE_ENV === "development" && {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "HH:MM:ss",
						ignore: "pid,hostname",
					},
				},
			}),
		});
		this.console.child({ name });
	}

	info(...args: unknown[]): void {
		const child = this.console.child({ name: this.name });
		for (const arg of args) {
			if (arg instanceof Error) {
				child.error(arg.message);
				child.error(arg.stack);
			} else {
				child.info(arg);
			}
		}
	}

	warn(...args: unknown[]): void {
		const child = this.console.child({ name: this.name });
		for (const arg of args) {
			if (arg instanceof Error) {
				child.error(arg.message);
				child.error(arg.stack);
			} else {
				child.warn(arg);
			}
		}
	}

	error(...args: unknown[]): void {
		const child = this.console.child({ name: this.name });
		child.error(args);
		for (const arg of args) {
			if (arg instanceof Error) {
				child.error(arg.message);
				child.error(arg.stack);
			} else {
				child.error(arg);
			}
		}
	}

	debug(...args: unknown[]): void {
		const child = this.console.child({ name: this.name });
		for (const arg of args) {
			if (arg instanceof Error) {
				child.error(arg.message);
				child.error(arg.stack);
			} else {
				child.debug(arg);
			}
		}
	}

	trace(...args: unknown[]): void {
		const child = this.console.child({ name: this.name });
		for (const arg of args) {
			if (arg instanceof Error) {
				child.error(arg.message);
				child.error(arg.stack);
			} else {
				child.trace(arg);
			}
		}
	}
}
