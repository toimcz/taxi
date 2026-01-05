export declare class Logger {
    private readonly name;
    private readonly isDev;
    constructor(name: string, isDev?: boolean);
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    table(...args: unknown[]): void;
    trace(...args: unknown[]): void;
}
//# sourceMappingURL=logger.d.ts.map