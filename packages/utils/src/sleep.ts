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
export function sleep(
	ms = 0,
	options?: { signal?: AbortSignal },
): Promise<void> {
	return new Promise((resolve, reject) => {
		const duration = Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;

		let timer: ReturnType<typeof setTimeout> | undefined;

		const onAbort = () => {
			if (timer !== undefined) {
				clearTimeout(timer);
				timer = undefined;
			}
			const err = new Error("Sleep aborted");
			(err as Error).name = "AbortError";
			reject(err);
		};

		if (options?.signal?.aborted) {
			// Already aborted: reject synchronously on next microtask
			// to maintain predictable async behavior
			queueMicrotask(onAbort);
			return;
		}

		if (options?.signal) {
			options.signal.addEventListener("abort", onAbort, { once: true });
		}

		timer = setTimeout(() => {
			if (options?.signal) {
				options.signal.removeEventListener("abort", onAbort);
			}
			resolve();
		}, duration);
	});
}
