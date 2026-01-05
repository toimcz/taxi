import { type BaseIssue, type BaseSchema, type FlatErrors, type InferOutput } from "valibot";
/**
 * Idempotency key used to safely retry the same mutation without duplicating effects.
 *
 * Accepts either:
 * - UUID (e.g. `crypto.randomUUID()`)
 * - 64-char hex string (e.g. sha256 hash)
 */
export declare const idempotencyKeySchema: (message?: string) => import("valibot", { with: { "resolution-mode": "require" } }).SchemaWithPipe<readonly [import("valibot", { with: { "resolution-mode": "require" } }).StringSchema<undefined>, import("valibot", { with: { "resolution-mode": "require" } }).UuidAction<string, string>]>;
type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;
type Issues<T extends Schema> = NonNullable<FlatErrors<T>["nested"]>;
type ResultWithIdempotency<T extends Schema> = {
    issues: undefined;
    output: InferOutput<T>;
    idempotencyKey: string;
} | {
    issues: Issues<T>;
    output: undefined;
    idempotencyKey?: string;
};
type Result<T extends Schema> = {
    issues: undefined;
    output: InferOutput<T>;
} | {
    issues: Issues<T>;
    output: undefined;
};
export declare const validateRequest: <T extends Schema>(schema: T, request: Request) => Promise<ResultWithIdempotency<T>>;
export declare const validateQuery: <T extends Schema>(schema: T, url: URL) => Result<T>;
export {};
//# sourceMappingURL=validate-request.d.ts.map