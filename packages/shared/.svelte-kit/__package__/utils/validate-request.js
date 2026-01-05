import { flatten, object, pipe, safeParse, string, uuid, } from "valibot";
/**
 * Idempotency key used to safely retry the same mutation without duplicating effects.
 *
 * Accepts either:
 * - UUID (e.g. `crypto.randomUUID()`)
 * - 64-char hex string (e.g. sha256 hash)
 */
export const idempotencyKeySchema = (message) => pipe(string(), uuid(message || "Neplatný idempotency key"));
export const validateRequest = async (schema, request) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const idempotencyInput = object({
        idempotencyKey: idempotencyKeySchema(),
    });
    const idempotencyValidated = safeParse(idempotencyInput, {
        idempotencyKey: typeof data.idempotencyKey === "string" ? data.idempotencyKey : "",
    });
    const validated = safeParse(schema, data);
    if (!validated.success) {
        const issues = (flatten(validated.issues).nested ?? {});
        if (!idempotencyValidated.success) {
            const idemIssues = flatten(idempotencyValidated.issues).nested;
            if (idemIssues?.idempotencyKey) {
                issues.idempotencyKey = idemIssues.idempotencyKey;
            }
        }
        return { issues, output: undefined };
    }
    if (!idempotencyValidated.success) {
        const issues = (flatten(idempotencyValidated.issues).nested ?? {});
        return { issues, output: undefined };
    }
    return {
        issues: undefined,
        output: validated.output,
        idempotencyKey: idempotencyValidated.output.idempotencyKey,
    };
};
export const validateQuery = (schema, url) => {
    const searchParams = url.searchParams;
    const data = Object.fromEntries(searchParams);
    const validated = safeParse(schema, data);
    if (!validated.success) {
        const issues = (flatten(validated.issues).nested ?? {});
        return { issues, output: undefined };
    }
    return {
        issues: undefined,
        output: validated.output,
    };
};
