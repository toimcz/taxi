<script lang="ts">
import { Info } from "@lucide/svelte";
import Tooltip from "../../Tooltip/Tooltip.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	checked?: boolean;
	disabled?: boolean;
	error?: string[] | undefined;
	setValue?: (value: boolean) => void;
};

let { id, label, name, checked = $bindable(false), disabled = false, error, setValue }: Props = $props();

const switchId = $derived(`${id}-switch`);
const errorId = $derived(error?.length ? `${id}-error` : undefined);

let focused = $state(false);
let hovered = $state(false);

function handleChange(e: Event) {
	if (disabled) return;
	const newValue = (e.target as HTMLInputElement).checked;
	checked = newValue;
	error = undefined;
	setValue?.(newValue);
}

function handleKeyDown(e: KeyboardEvent) {
	if (disabled) return;
	// Space or Enter to toggle
	if (e.key === " " || e.key === "Enter") {
		e.preventDefault();
		const newValue = !checked;
		checked = newValue;
		error = undefined;
		setValue?.(newValue);
	}
}

function handleFocus() {
	focused = true;
}

function handleBlur() {
	focused = false;
}

function handleMouseEnter() {
	if (!disabled) hovered = true;
}

function handleMouseLeave() {
	hovered = false;
}
</script>

<div class="relative flex flex-col gap-2">
  <label for={switchId} class="text-xs font-semibold uppercase tracking-wide text-gray-700">
    {label}
  </label>

  <div class="flex items-center">
    <!-- Accessible switch container -->
    <label
      for={switchId}
      class="relative inline-flex cursor-pointer items-center group"
      class:cursor-not-allowed={disabled}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      <!-- Actual checkbox input (visually hidden but accessible) -->
      <input
        id={switchId}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={errorId}
        aria-disabled={disabled}
        {disabled}
        class="sr-only"
        {checked}
        onchange={handleChange}
        onkeydown={handleKeyDown}
        onfocus={handleFocus}
        onblur={handleBlur}
      />

      <!-- Hidden input for form submission with actual boolean value -->
      <input type="hidden" {name} value={checked ? 'true' : 'false'} />

      <!-- Visual switch track -->
      <span
        class="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out"
        class:bg-emerald-500={checked && !disabled}
        class:bg-emerald-600={checked && hovered && !disabled}
        class:bg-gray-200={!checked && !disabled}
        class:bg-gray-300={!checked && hovered && !disabled}
        class:opacity-50={disabled}
        class:ring-1={focused}
        class:ring-emerald-400={focused && checked}
        class:ring-blue-400={focused && !checked}
        class:ring-offset-1={focused}
        class:shadow-inner={!checked}
        class:shadow-md={checked}
      >
        <!-- Switch thumb -->
        <span
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out"
          class:translate-x-4.5={checked}
          class:translate-x-0.5={!checked}
          class:scale-105={hovered && !disabled}
        ></span>
      </span>
    </label>
  </div>

  {#if error?.length}
    <div class="absolute top-0 right-0">
      <Tooltip content={error.join(', ')}>
        <Info size={16} class="text-red-500" />
      </Tooltip>
    </div>
  {/if}
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
