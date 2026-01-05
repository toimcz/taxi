import { getContext, hasContext, setContext } from "svelte";
import { v7 as uuidv7 } from "uuid";
import { flatten, safeParse } from "valibot";
import { dev } from "$app/environment";
import { applyAction } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { Logger } from "../utils/logger.js";
export class FormBase {
    schema;
    props;
    #logger = new Logger("UseForm", dev);
    #processing = $state(false);
    #issues = $state();
    #idempotencyKey = uuidv7();
    get processing() {
        return this.#processing;
    }
    get issues() {
        return this.#issues;
    }
    constructor(schema, props) {
        this.schema = schema;
        this.props = props;
    }
    submit = async ({ formData, cancel }) => {
        this.#processing = true;
        this.#issues = undefined;
        // Ensure every mutation request carries a stable idempotency key (per form instance),
        // so retries/double submits can be safely deduplicated downstream.
        formData.set("idempotencyKey", this.#idempotencyKey);
        if (this.schema) {
            const body = Object.fromEntries(formData.entries());
            const validated = safeParse(this.schema, body);
            if (!validated.success) {
                const issues = flatten(validated.issues).nested;
                this.#issues = issues;
                this.#logger.table(issues);
                this.#processing = false;
                cancel();
                return;
            }
        }
        return async ({ result }) => {
            if (result.type === "success" && result.data) {
                await this.props.onSuccess(result.data);
                this.#idempotencyKey = uuidv7();
                await invalidateAll();
            }
            else if (result.type === "failure") {
                if (result.data && typeof result.data === "object" && "message" in result.data) {
                    await this.props.onError(result.data.message);
                }
                else if (result.data) {
                    this.#issues = result.data;
                }
                else {
                    await this.props.onError("Nastala neočekávaná chyba");
                }
            }
            else {
                await this.props.onError("Nastala neočekávaná chyba");
            }
            this.#processing = false;
            applyAction(result);
        };
    };
}
export function useForm(schema, props) {
    const key = Symbol();
    const form = new FormBase(schema, props);
    setContext(key, form);
    return form;
}
export function useFormWithKey(schema, props, key) {
    if (hasContext(key)) {
        return getContext(key);
    }
    const form = new FormBase(schema, props);
    setContext(key, form);
    return form;
}
export function getForm(key) {
    return getContext(key);
}
