/**
 * Creates a debounced function that delays invoking `fn` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @template T - The function type to debounce
 * @param fn - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @param options - Optional configuration
 * @param options.immediate - If `true`, trigger the function on the leading edge instead of trailing
 * @returns A debounced function with a `cancel` method to cancel pending invocations
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('hello');
 * debouncedSearch('world'); // Only 'world' will be logged after 300ms
 *
 * // Cancel pending invocation
 * debouncedSearch.cancel();
 * ```
 */
export declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number, options?: {
    immediate?: boolean;
}): ((...args: Parameters<T>) => void) & {
    cancel: () => void;
    flush: () => void;
};
//# sourceMappingURL=debounce.d.ts.map