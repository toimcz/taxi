const colors = {
    info: "color: #3b82f6; font-weight: bold",
    warn: "color: #f59e0b; font-weight: bold",
    error: "color: #ef4444; font-weight: bold",
    debug: "color: #8b5cf6; font-weight: bold",
    trace: "color: #6b7280; font-weight: bold",
};
export class Logger {
    name;
    isDev;
    constructor(name, isDev = false) {
        this.name = name;
        this.isDev = isDev;
    }
    info(...args) {
        if (this.isDev) {
            console.info(`%c[${this.name}]`, colors.info, ...args);
        }
    }
    warn(...args) {
        if (this.isDev) {
            console.warn(`%c[${this.name}]`, colors.warn, ...args);
        }
    }
    error(...args) {
        console.error(`%c[${this.name}]`, colors.error, ...args);
    }
    debug(...args) {
        if (this.isDev) {
            console.debug(`%c[${this.name}]`, colors.debug, ...args);
        }
    }
    table(...args) {
        if (this.isDev) {
            console.table(...args);
        }
    }
    trace(...args) {
        if (this.isDev) {
            console.trace(`%c[${this.name}]`, colors.trace, ...args);
        }
    }
}
