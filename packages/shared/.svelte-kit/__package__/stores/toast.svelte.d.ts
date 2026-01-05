export interface ToastType {
    id: string;
    message: string;
    type: "error" | "message";
}
export declare class ToastStore {
    private toastToTimeoutMap;
    toasts: ToastType[];
    add(type: "error" | "message", message: string, durationMs?: number): void;
    remove(id: string): void;
    clear(): void;
}
export declare const setToastStore: () => ToastStore;
export declare const useToastStore: () => ToastStore;
//# sourceMappingURL=toast.svelte.d.ts.map