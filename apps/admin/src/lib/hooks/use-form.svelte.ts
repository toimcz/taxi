import type { SubmitFunction } from "@sveltejs/kit";
import { getContext, hasContext, setContext } from "svelte";
import { v7 as uuidv7 } from "uuid";
import { type BaseIssue, type BaseSchema, type FlatErrors, flatten, safeParse } from "valibot";
import { applyAction } from "$app/forms";
import { invalidateAll } from "$app/navigation";

type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;

export type FormProps = {
	onSuccess: () => void | Promise<void>;
	onError: (message: string) => void | Promise<void>;
};

export class FormBase<T extends Schema | undefined> {
	#processing = $state(false);
	#issues = $state<FlatErrors<T>["nested"]>();
	#idempotencyKey = $state(uuidv7());

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
				console.log("Validation failed", validated.issues);
				this.#issues = flatten(validated.issues).nested as FlatErrors<T>["nested"];
				this.#processing = false;
				cancel();
				return;
			}
		}

		return async ({ result }) => {
			if (result.type === "success") {
				await invalidateAll();
				await this.props.onSuccess();
				this.#idempotencyKey = uuidv7();
			} else if (result.type === "failure" && result.data) {
				const data = result.data as FlatErrors<T>["nested"];
				this.#issues = data;
			} else if (result.type === "failure" && result.data?.message) {
				await this.props.onError(result.data.message);
			} else {
				await this.props.onError("Nastala neočekávaná chyba");
			}
			this.#processing = false;
			applyAction(result);
		};
	};
}

const FORM_KEY = Symbol("form");

export function useForm<T extends Schema>(schema: T, props: FormProps) {
	if (hasContext(FORM_KEY)) {
		return getContext<FormBase<T>>(FORM_KEY);
	}
	const form = new FormBase(schema, props);
	setContext(FORM_KEY, () => form);
	return form;
}

export function setForm<T extends Schema>(schema: T, props: FormProps) {
	setContext(FORM_KEY, () => new FormBase(schema, props));
}
