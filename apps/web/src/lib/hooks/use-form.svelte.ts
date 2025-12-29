import type { SubmitFunction } from "@sveltejs/kit";
import { getContext, hasContext, setContext } from "svelte";
import { type BaseIssue, type BaseSchema, type FlatErrors, flatten, safeParse } from "valibot";
import { applyAction } from "$app/forms";

type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

export type FormProps = {
	onSuccess: () => void | Promise<void>;
	onError: (message: string) => void | Promise<void>;
};

export class FormBase<T extends Schema | undefined> {
	#processing = $state(false);
	#issues = $state<FlatErrors<T>["nested"]>();
	#idempotencyKey = $state(globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);

	get processing() {
		return this.#processing;
	}

	get issues() {
		return this.#issues;
	}

	constructor(
		private readonly schema: T,
		private readonly props: FormProps,
	) {}

	submit: SubmitFunction = async ({ formData }) => {
		this.#processing = true;
		this.#issues = undefined;

		// Ensure every mutation request carries a stable idempotency key (per form instance),
		// so retries/double submits can be safely deduplicated downstream.
		formData.set("idempotencyKey", this.#idempotencyKey);

		if (this.schema) {
			const body = Object.fromEntries(formData.entries());
			const validated = safeParse(this.schema, body);
			if (!validated.success) {
				this.#issues = flatten(validated.issues).nested as FlatErrors<T>["nested"];
				return;
			}
		}

		return async ({ result }) => {
			console.log({ result });
			if (result.type === "success") {
				await this.props.onSuccess();
				this.#idempotencyKey =
					globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
			} else if (result.type === "failure" && result.status === 422 && result.data) {
				const data = result.data as FlatErrors<T>["nested"];
				this.#issues = data;
			} else if (result.type === "failure" && result.data?.message) {
				await this.props.onError(result.data.message);
			} else if (result.type === "error") {
				await this.props.onError("Nastala neočekávaná chyba");
			}
			this.#processing = false;
			applyAction(result);
		};
	};
}

const FORM_KEY = Symbol("form");

export function useForm<T extends Schema>(schema: T, props: FormProps) {
	if (!hasContext(FORM_KEY)) {
		setContext(FORM_KEY, new FormBase(schema, props));
	}
	return getContext<FormBase<T>>(FORM_KEY);
}

export function setForm<T extends Schema>(schema: T, props: FormProps) {
	setContext(FORM_KEY, new FormBase(schema, props));
}
