<script lang="ts">
import type { FullAutoFill } from "svelte/elements";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	autocomplete?: FullAutoFill | null | undefined;
	error?: string[] | undefined;
	rows?: number;
	setValue?: (value: string) => void;
};

let {
	id,
	label,
	value = $bindable(""),
	placeholder,
	name,
	disabled = false,
	autocomplete = "off",
	error,
	rows = 3,
	setValue,
}: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLTextAreaElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <textarea
    {id}
    bind:value
    {placeholder}
    class="form-control"
    {name}
    {disabled}
    {autocomplete}
    {rows}
    oninput={setInputValue}
  ></textarea>
</Input>
