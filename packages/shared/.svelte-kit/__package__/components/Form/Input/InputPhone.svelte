<script lang="ts">
import type { FullAutoFill } from "svelte/elements";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: string;
	placeholder?: string;
	autocomplete?: FullAutoFill | null | undefined;
	error?: string[] | undefined;
	setValue?: (v: string) => void;
};

let { id, label, value = $bindable(""), placeholder, name, error, autocomplete = "off", setValue }: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLInputElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <input
    {id}
    type="tel"
    bind:value
    {placeholder}
    class="form-control"
    {name}
    {autocomplete}
    oninput={setInputValue}
  />
</Input>
