import {
	type BaseIssue,
	type BaseSchema,
	type FlatErrors,
	flatten,
	type InferOutput,
	object,
	pipe,
	safeParse,
	string,
	uuid,
} from "valibot";

/**
 * Idempotency key used to safely retry the same mutation without duplicating effects.
 *
 * Accepts either:
 * - UUID (e.g. `crypto.randomUUID()`)
 * - 64-char hex string (e.g. sha256 hash)
 */
export const idempotencyKeySchema = (message?: string) =>
	pipe(string(), uuid(message || "Neplatný idempotency key"));

type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

type Issues<T extends Schema> = NonNullable<FlatErrors<T>["nested"]>;

type ResultWithIdempotency<T extends Schema> =
	| {
			issues: undefined;
			output: InferOutput<T>;
			idempotencyKey: string;
	  }
	| {
			issues: Issues<T>;
			output: undefined;
			idempotencyKey?: string;
	  };

type Result<T extends Schema> =
	| {
			issues: undefined;
			output: InferOutput<T>;
	  }
	| {
			issues: Issues<T>;
			output: undefined;
	  };

export const validateRequest = async <T extends Schema>(
	schema: T,
	request: Request,
): Promise<ResultWithIdempotency<T>> => {
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
		const issues = (flatten(validated.issues).nested ?? {}) as Issues<T>;

		if (!idempotencyValidated.success) {
			const idemIssues = flatten(idempotencyValidated.issues).nested;
			if (idemIssues?.idempotencyKey) {
				(issues as Record<string, unknown>).idempotencyKey = idemIssues.idempotencyKey;
			}
		}

		return { issues, output: undefined };
	}

	if (!idempotencyValidated.success) {
		const issues = (flatten(idempotencyValidated.issues).nested ?? {}) as Issues<T>;
		return { issues, output: undefined };
	}

	return {
		issues: undefined,
		output: validated.output,
		idempotencyKey: idempotencyValidated.output.idempotencyKey,
	};
};

export const validateQuery = <T extends Schema>(schema: T, url: URL): Result<T> => {
	const searchParams = url.searchParams;
	const data = Object.fromEntries(searchParams);

	const validated = safeParse(schema, data);
	if (!validated.success) {
		const issues = (flatten(validated.issues).nested ?? {}) as Issues<T>;
		return { issues, output: undefined };
	}

	return {
		issues: undefined,
		output: validated.output,
	};
};
