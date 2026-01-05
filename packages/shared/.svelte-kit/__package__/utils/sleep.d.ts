/**
 * Pause execution for at least `ms` milliseconds.
 *
 * - Clamps non-finite or negative values to `0`.
 * - Always resolves asynchronously via `setTimeout`.
 * - Supports cancellation via `AbortSignal` (rejects with `AbortError`).
 *
 * @example
 * // Basic usage
 * await sleep(250);
 *
 * @example
 * // Cancellable sleep
 * const controller = new AbortController();
 * const p = sleep(5000, { signal: controller.signal })
 *   .catch((err) => {
 *     if ((err as Error).name === 'AbortError') {
 *       console.log('Sleep cancelled');
 *     } else {
 *       throw err;
 *     }
 *   });
 * controller.abort();
 *
 * @param ms Milliseconds to wait.
 * @param options Optional configuration, including an `AbortSignal` for cancellation.
 * @returns Promise that resolves after the delay or rejects if aborted.
 */
export declare function sleep(ms?: number, options?: {
    signal?: AbortSignal;
}): Promise<void>;
//# sourceMappingURL=sleep.d.ts.map