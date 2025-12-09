import type { SubmitFunction } from "@sveltejs/kit";
import { applyAction } from "$app/forms";
import { type ToastStore, useToastStore } from "$lib/stores/toast.svelte.js";

export type SubmitFormProps = {
	onSuccess: (toast: ToastStore) => void | Promise<void>;
};

export function useForm({ onSuccess }: SubmitFormProps) {
	const toast = useToastStore();
	let processing = $state(false);
	const issues = $state<Record<string, string[]>>({});

	const submit: SubmitFunction = () => {
		processing = true;
		return async ({ result }) => {
			if (result.type === "success") {
				await onSuccess(toast);
			} else if (result.type === "failure") {
				if (result.data && typeof result.data === "object") {
					Object.entries(result.data).forEach(([key, value]) => {
						if (value) {
							issues[key] = typeof value === "string" ? [value] : value;
						}
					});
				}
				if (result.data?.message && typeof result.data.message === "string") {
					toast.add("error", result.data.message);
				}
			}
			processing = false;
			applyAction(result);
		};
	};

	return {
		processing: () => processing,
		submit,
		issues,
	};
}
