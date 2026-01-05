import type { SubmitFunction } from "@sveltejs/kit";
import { getContext, hasContext, setContext } from "svelte";
import { v7 as uuidv7 } from "uuid";
import { type BaseIssue, type BaseSchema, type FlatErrors, flatten, safeParse } from "valibot";
import { dev } from "$app/environment";
import { applyAction } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { Logger } from "../utils/logger.js";

type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

export type FormProps<TData extends Record<string, unknown> = Record<string, unknown>> = {
	onSuccess: (data: TData) => void | Promise<void>;
	onError: (message: string) => void | Promise<void>;
};

export class FormBase<
	T extends Schema | undefined,
	TData extends Record<string, unknown> = Record<string, unknown>,
> {
	#logger = new Logger("UseForm", dev);
	#processing = $state(false);
	#issues = $state<FlatErrors<T>["nested"]>();
	#idempotencyKey = uuidv7();

	get processing() {
		return this.#processing;
	}

	get issues() {
		return this.#issues;
	}

	constructor(
		private readonly schema: T,
		private readonly props: FormProps<TData>,
	) {}

	submit: SubmitFunction = async ({ formData, cancel }) => {
		this.#processing = true;
		this.#issues = undefined;

		// Ensure every mutation request carries a stable idempotency key (per form instance),
		// so retries/double submits can be safely deduplicated downstream.
		formData.set("idempotencyKey", this.#idempotencyKey);

		if (this.schema) {
			const body = Object.fromEntries(formData.entries());
			const validated = safeParse(this.schema, body);
			if (!validated.success) {
				const issues = flatten(validated.issues).nested as FlatErrors<T>["nested"];
				this.#issues = issues;
				this.#logger.table(issues);
				this.#processing = false;
				cancel();
				return;
			}
		}

		return async ({ result }) => {
			if (result.type === "success" && result.data) {
				await this.props.onSuccess(result.data as TData);
				this.#idempotencyKey = uuidv7();
				await invalidateAll();
			} else if (result.type === "failure") {
				if (result.data && typeof result.data === "object" && "message" in result.data) {
					await this.props.onError(result.data.message as string);
				} else if (result.data) {
					this.#issues = result.data as FlatErrors<T>["nested"];
				} else {
					await this.props.onError("Nastala neočekávaná chyba");
				}
			} else {
				await this.props.onError("Nastala neočekávaná chyba");
			}
			this.#processing = false;
			applyAction(result);
		};
	};
}

export function useForm<
	T extends Schema | undefined,
	TData extends Record<string, unknown> = Record<string, unknown>,
>(schema: T, props: FormProps<TData>) {
	const key = Symbol();
	const form = new FormBase<T, TData>(schema, props);
	setContext(key, form);
	return form;
}

export function useFormWithKey<
	T extends Schema,
	TData extends Record<string, unknown> = Record<string, unknown>,
>(schema: T, props: FormProps<TData>, key: symbol) {
	if (hasContext(key)) {
		return getContext<FormBase<T, TData>>(key);
	}
	const form = new FormBase<T, TData>(schema, props);
	setContext(key, form);
	return form;
}

export function getForm<
	T extends Schema,
	TData extends Record<string, unknown> = Record<string, unknown>,
>(key: symbol) {
	return getContext<FormBase<T, TData>>(key);
}
