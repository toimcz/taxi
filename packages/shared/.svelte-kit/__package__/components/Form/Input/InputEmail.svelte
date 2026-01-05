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
	setValue?: (value: string) => void;
};

let { id, label, value = $bindable(""), placeholder, name, error, autocomplete = "email", setValue }: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLInputElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <input
    {id}
    type="email"
    bind:value
    oninput={setInputValue}
    {placeholder}
    class="form-control"
    {name}
    {autocomplete}
  />
</Input>
