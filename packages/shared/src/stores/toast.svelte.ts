import { getContext, setContext } from "svelte";

export interface ToastType {
	id: string;
	message: string;
	type: "error" | "message";
}

export class ToastStore {
	private toastToTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();
	public toasts = $state<ToastType[]>([]);

	public add(type: "error" | "message", message: string, durationMs = 5000) {
		const id = crypto.randomUUID();
		this.toasts.push({ id, message, type });
		this.toastToTimeoutMap.set(
			id,
			setTimeout(() => {
				this.remove(id);
			}, durationMs),
		);
	}

	public remove(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
		this.toastToTimeoutMap.delete(id);
	}

	public clear() {
		this.toasts = [];
		this.toastToTimeoutMap.forEach((t) => {
			clearTimeout(t);
		});
		this.toastToTimeoutMap.clear();
	}
}

const SEARCH_KEY = Symbol("toasts");

export const setToastStore = () => setContext(SEARCH_KEY, new ToastStore());

export const useToastStore = () => getContext<ReturnType<typeof setToastStore>>(SEARCH_KEY);
