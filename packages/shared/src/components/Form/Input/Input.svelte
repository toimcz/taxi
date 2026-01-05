<script lang="ts">
import { CircleCheck } from "@lucide/svelte";
import type { Snippet } from "svelte";

type Props = {
	id: string;
	label: string;
	children: Snippet;
	error?: string[] | undefined;
	helperText?: string;
	required?: boolean;
	disabled?: boolean;
	success?: boolean;
};

const {
	id,
	label,
	children,
	error,
	helperText,
	required = false,
	disabled = false,
	success = false,
}: Props = $props();

const errorId = $derived(error?.length ? `${id}-error` : undefined);
const helperId = $derived(helperText ? `${id}-helper` : undefined);
const describedBy = $derived([errorId, helperId].filter(Boolean).join(" ") || undefined);

let hovered = $state(false);
let hasError = $derived(error?.length ?? false);

function handleMouseEnter() {
	if (!disabled) hovered = true;
}

function handleMouseLeave() {
	hovered = false;
}
</script>

<div
  class="input-wrapper relative flex flex-col"
  role="group"
  aria-labelledby={id}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  <!-- Input Container with floating label -->
  <div
    class="input-container group relative flex flex-col gap-0 rounded-lg border-2 transition-all duration-300 ease-out"
    class:bg-white={!disabled}
    class:bg-slate-50={disabled}
    class:border-slate-200={(!hasError && !success && !disabled) || disabled}
    class:border-emerald-300={success && !disabled}
    class:border-red-300={hasError && !disabled}
    class:opacity-50={disabled}
    class:cursor-not-allowed={disabled}
    data-error={hasError ? 'true' : undefined}
    data-success={success ? 'true' : undefined}
    data-disabled={disabled ? 'true' : undefined}
    style="padding: 0.75rem 1rem 0.75rem 1rem;"
  >
    <!-- Floating label overlapping border -->
    <label
      for={id}
      class="floating-label absolute left-3 -top-2.5 px-2 text-xs font-semibold tracking-wide transition-all duration-300 ease-out cursor-pointer z-10"
      class:bg-white={!disabled}
      class:bg-slate-50={disabled}
      class:text-slate-600={!hasError && !success && !disabled}
      class:text-emerald-600={success && !disabled}
      class:text-red-600={hasError && !disabled}
      class:text-slate-400={disabled}
      class:cursor-not-allowed={disabled}
    >
      <span class="inline-flex items-center gap-1">
        {label}
        {#if required}
          <span class="text-red-500 text-[10px] font-bold" aria-label="required">*</span>
        {/if}
      </span>
    </label>

    {@render children?.()}

    <!-- Success Icon -->
    {#if success && !hasError && !disabled}
      <div
        class="status-icon absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none z-10 text-emerald-500"
        style="animation: scaleIn 0.2s ease-out;"
      >
        <CircleCheck size={20} aria-hidden="true" />
      </div>
    {/if}
  </div>

  <!-- Helper Text and Error Message Container - Fixed height to prevent layout shift -->
  <div class="message-container">
    <!-- Helper Text -->
    {#if helperText && !hasError}
      <p
        id={helperId}
        class="helper-text px-1 text-xs text-slate-500 transition-all duration-300 ease-out"
        class:text-slate-400={disabled}
        class:text-emerald-600={success && !disabled}
      >
        {helperText}
      </p>
    {/if}

    <!-- Error Message (for screen readers and visible display) -->
    {#if hasError && error}
      <p
        id={errorId}
        class="error-message px-1 text-xs font-medium text-red-600 transition-all duration-300 ease-out"
        role="alert"
        aria-live="polite"
        style="animation: slideDown 0.3s ease-out;"
      >
        {error.join(', ')}
      </p>
    {/if}
  </div>
</div>

<style>
  /* Input element styles */
  :global(.input-container :where(input, select, textarea)) {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: rgb(15 23 42); /* slate-900 */
    transition: color 0.2s ease-out;
  }

  :global(.input-container :where(input, select, textarea)::placeholder) {
    color: rgb(148 163 184); /* slate-400 */
    opacity: 0.6;
  }

  :global(.input-container :where(input, select, textarea):focus) {
    outline: none;
  }

  :global(.input-container :where(input, select, textarea):disabled) {
    cursor: not-allowed;
    color: rgb(148 163 184);
  }

  /* Floating label styles */
  :global(.floating-label) {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Focus-within styles for container - normal state */
  :global(
      .input-container:focus-within:not([data-error]):not([data-success]):not([data-disabled])
    ) {
    border-color: rgb(59 130 246); /* blue-500 */
  }

  /* Floating label color change on focus - normal state */
  :global(
      .input-container:focus-within:not([data-error]):not([data-success]):not([data-disabled])
        .floating-label
    ) {
    color: rgb(59 130 246); /* blue-500 */
  }

  /* Focus-within styles for container - success state */
  :global(.input-container:focus-within[data-success]:not([data-disabled])) {
    border-color: rgb(16 185 129); /* emerald-500 */
  }

  /* Floating label color change on focus - success state */
  :global(.input-container:focus-within[data-success]:not([data-disabled]) .floating-label) {
    color: rgb(16 185 129); /* emerald-500 */
  }

  /* Focus-within styles for container - error state */
  :global(.input-container:focus-within[data-error]:not([data-disabled])) {
    border-color: rgb(239 68 68); /* red-500 */
  }

  /* Floating label color change on focus - error state */
  :global(.input-container:focus-within[data-error]:not([data-disabled]) .floating-label) {
    color: rgb(239 68 68); /* red-500 */
  }

  /* Disabled state - no focus effects */
  :global(.input-container[data-disabled]:focus-within) {
    border-color: rgb(226 232 240); /* slate-200 */
  }

  /* Hover effects */
  :global(.input-container:not([data-disabled]):hover:not(:focus-within)) {
    border-color: rgb(148 163 184); /* slate-400 */
  }

  :global(.input-container[data-success]:not([data-disabled]):hover:not(:focus-within)) {
    border-color: rgb(52 211 153); /* emerald-400 */
  }

  :global(.input-container[data-error]:not([data-disabled]):hover:not(:focus-within)) {
    border-color: rgb(248 113 113); /* red-400 */
  }

  /* Animations */
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateY(-50%) translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateY(-50%) translateX(-4px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateY(-50%) translateX(4px);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Smooth transitions for helper/error text */
  .helper-text,
  .error-message {
    will-change: opacity, transform;
  }

  /* Message container - fixed height prevents layout shift */
  .message-container {
    min-height: 1.5rem;
    line-height: 1.5rem;
  }

  /* Ensure error messages are visible and readable */
  .error-message {
    display: block;
    visibility: visible;
    opacity: 1;
    color: rgb(220 38 38); /* red-600 */
    font-weight: 500;
  }
</style>
