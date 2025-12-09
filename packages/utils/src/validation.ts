import {
	array,
	type BaseIssue,
	type BaseSchema,
	parse,
	safeParse,
} from "valibot";

/**
 * Validates arbitrary `data` against a Valibot `schema` without throwing.
 * - Returns a result object indicating success or failure.
 * - Use when you want to handle validation errors gracefully.
 *
 * @template TInput Input type expected by the schema
 * @template TOutput Output type produced by the schema
 * @template TIssue Issue type used by the schema
 * @param schema Valibot schema to validate against
 * @param data Unknown data to validate
 * @returns The result of `safeParse`, containing either `output` or `issues`
 * @example
 * // Safe validation (no throw)
 * const result = validate(userSchema, maybeUser);
 * if (result.success) {
 *   console.log(result.output);
 * } else {
 *   console.error(result.issues);
 * }
 */
export const validate = <TInput, TOutput, TIssue extends BaseIssue<unknown>>(
	schema: BaseSchema<TInput, TOutput, TIssue>,
	data: unknown,
) => {
	return safeParse(schema, data);
};

/**
 * Validates an array of items against a Valibot `schema` without throwing.
 * - Each element is validated against the provided item `schema`.
 * - Returns a result object indicating success or failure.
 *
 * @template TInput Input type for each array element
 * @template TOutput Output type for each array element
 * @template TIssue Issue type used by the schema
 * @param schema Valibot schema for array elements
 * @param data Unknown array data to validate
 * @returns The result of `safeParse(array(schema), data)`
 * @example
 * const res = validateArray(userSchema, input);
 * if (res.success) {
 *   // res.output is TOutput[]
 * } else {
 *   console.error(res.issues);
 * }
 */
export const validateArray = <
	TInput,
	TOutput,
	TIssue extends BaseIssue<unknown>,
>(
	schema: BaseSchema<TInput, TOutput, TIssue>,
	data: unknown,
) => {
	return safeParse(array(schema), data);
};

/**
 * Validates `data` against a Valibot `schema` and throws on failure.
 * - On success, returns `TOutput`.
 * - On failure, throws a `ValiError<TIssue>` (from Valibot).
 *
 * @template TInput Input type expected by the schema
 * @template TOutput Output type produced by the schema
 * @template TIssue Issue type used by the schema
 * @param schema Valibot schema to validate against
 * @param data Strongly-typed input data to validate (`TInput`)
 * @returns The validated and parsed `TOutput`
 * @throws {ValiError<TIssue>} When validation fails
 * @example
 * try {
 *   const user = validateAndThrow(userSchema, input);
 *   // user is TOutput
 * } catch (e) {
 *   // e is ValiError<TIssue>
 * }
 */
export const validateAndThrow = <
	TInput,
	TOutput,
	TIssue extends BaseIssue<unknown>,
>(
	schema: BaseSchema<TInput, TOutput, TIssue>,
	data: TInput,
): TOutput => {
	return parse(schema, data);
};

/**
 * Validates an array of items against a Valibot `schema` and throws on failure.
 * - On success, returns `TOutput[]` for the validated array.
 * - On failure, throws a `ValiError<TIssue>`.
 *
 * @template TInput Input type for each array element
 * @template TOutput Output type for each array element
 * @template TIssue Issue type used by the schema
 * @param schema Valibot schema for array elements
 * @param data Strongly-typed input array to validate (`TInput[]`)
 * @returns The validated and parsed `TOutput[]`
 * @throws {ValiError<TIssue>} When any element fails validation
 * @example
 * const users = validateArrayAndThrow(userSchema, inputArray);
 */
export const validateArrayAndThrow = <
	TInput,
	TOutput,
	TIssue extends BaseIssue<unknown>,
>(
	schema: BaseSchema<TInput, TOutput, TIssue>,
	data: TInput[],
): TOutput[] => {
	return parse(array(schema), data);
};
