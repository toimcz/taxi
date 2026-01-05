const colors = {
	info: "color: #3b82f6; font-weight: bold",
	warn: "color: #f59e0b; font-weight: bold",
	error: "color: #ef4444; font-weight: bold",
	debug: "color: #8b5cf6; font-weight: bold",
	trace: "color: #6b7280; font-weight: bold",
} as const;

export class Logger {
	constructor(
		private readonly name: string,
		private readonly isDev = false,
	) {}

	info(...args: unknown[]): void {
		if (this.isDev) {
			console.info(`%c[${this.name}]`, colors.info, ...args);
		}
	}

	warn(...args: unknown[]): void {
		if (this.isDev) {
			console.warn(`%c[${this.name}]`, colors.warn, ...args);
		}
	}

	error(...args: unknown[]): void {
		console.error(`%c[${this.name}]`, colors.error, ...args);
	}

	debug(...args: unknown[]): void {
		if (this.isDev) {
			console.debug(`%c[${this.name}]`, colors.debug, ...args);
		}
	}

	table(...args: unknown[]): void {
		if (this.isDev) {
			console.table(...args);
		}
	}

	trace(...args: unknown[]): void {
		if (this.isDev) {
			console.trace(`%c[${this.name}]`, colors.trace, ...args);
		}
	}
}
