<script lang="ts">
import { Eye, EyeOff } from "@lucide/svelte";
import type { FullAutoFill } from "svelte/elements";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	value?: string;
	placeholder?: string;
	name: string;
	autocomplete?: FullAutoFill | null | undefined;
	error?: string[] | undefined;
	required?: boolean;
	disabled?: boolean;
	helperText?: string;
	minlength?: number;
	maxlength?: number;
};

let {
	id,
	label,
	value = $bindable(""),
	placeholder,
	name,
	autocomplete = "current-password",
	error,
	required = false,
	disabled = false,
	helperText,
	minlength,
	maxlength,
}: Props = $props();

let showPassword = $state(false);
let inputType = $derived(showPassword ? "text" : "password");

function togglePasswordVisibility() {
	if (!disabled) {
		showPassword = !showPassword;
	}
}

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement;
	value = target.value;
}
</script>

<Input {id} {label} {error} {required} {disabled} {helperText}>
  <div class="relative w-full">
    <input
      {id}
      type={inputType}
      bind:value
      {placeholder}
      class="form-control pr-10"
      {name}
      {autocomplete}
      {required}
      {disabled}
      {minlength}
      {maxlength}
      oninput={handleInput}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : undefined}
    />

    <!-- Password visibility toggle button - hidden when error is shown -->
    {#if !error?.length}
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-200 hover:text-slate-700 focus:outline-none focus:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
        class:text-slate-400={!disabled}
        class:text-slate-300={disabled}
        onclick={togglePasswordVisibility}
        {disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabindex={disabled ? -1 : 0}
      >
        {#if showPassword}
          <EyeOff size={18} aria-hidden="true" />
        {:else}
          <Eye size={18} aria-hidden="true" />
        {/if}
      </button>
    {/if}
  </div>
</Input>

<style>
  /* Additional padding for the input to prevent text from overlapping the icon */
  :global(.form-control) {
    padding-right: 2.5rem;
  }
</style>
