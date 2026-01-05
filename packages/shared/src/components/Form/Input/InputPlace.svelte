<script lang="ts">
import type { FullAutoFill } from "svelte/elements";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	city: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	autocomplete?: FullAutoFill | null | undefined;
	error?: string[] | undefined;
	setValue?: (v: string) => void;
};

let {
	id,
	label,
	value = $bindable(""),
	city,
	placeholder,
	name,
	disabled = false,
	autocomplete = "off",
	error,
	setValue,
}: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLInputElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <div class="form-control flex items-center gap-x-2">
    <div
      class="text-primary whitespace-nowrap text-sm underline decoration-blue-400 decoration-2 underline-offset-4"
    >
      {city}:
    </div>
    <input
      {id}
      type="text"
      bind:value
      {placeholder}
      {name}
      {disabled}
      {autocomplete}
      oninput={setInputValue}
    />
  </div>
</Input>
