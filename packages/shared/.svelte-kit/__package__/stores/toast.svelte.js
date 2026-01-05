import { getContext, setContext } from "svelte";
export class ToastStore {
    toastToTimeoutMap = new Map();
    toasts = $state([]);
    add(type, message, durationMs = 5000) {
        const id = crypto.randomUUID();
        this.toasts.push({ id, message, type });
        this.toastToTimeoutMap.set(id, setTimeout(() => {
            this.remove(id);
        }, durationMs));
    }
    remove(id) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.toastToTimeoutMap.delete(id);
    }
    clear() {
        this.toasts = [];
        this.toastToTimeoutMap.forEach((t) => {
            clearTimeout(t);
        });
        this.toastToTimeoutMap.clear();
    }
}
const SEARCH_KEY = Symbol("toasts");
export const setToastStore = () => setContext(SEARCH_KEY, new ToastStore());
export const useToastStore = () => getContext(SEARCH_KEY);
