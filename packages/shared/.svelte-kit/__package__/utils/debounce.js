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
// biome-ignore lint/suspicious/noExplicitAny: Generic constraint requires any to accept any function signature
export function debounce(fn, delay, options) {
    if (typeof fn !== "function") {
        throw new TypeError("Expected a function");
    }
    if (typeof delay !== "number" || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Delay must be a non-negative finite number");
    }
    let timeoutId;
    const immediate = options?.immediate ?? false;
    let lastArgs;
    const cancel = () => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }
        lastArgs = undefined;
    };
    const flush = () => {
        if (lastArgs !== undefined && timeoutId !== undefined) {
            cancel();
            fn(...lastArgs);
        }
    };
    const debounced = (...args) => {
        lastArgs = args;
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        if (immediate && timeoutId === undefined) {
            fn(...args);
        }
        timeoutId = setTimeout(() => {
            if (!immediate && lastArgs !== undefined) {
                fn(...lastArgs);
            }
            timeoutId = undefined;
            lastArgs = undefined;
        }, delay);
    };
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
