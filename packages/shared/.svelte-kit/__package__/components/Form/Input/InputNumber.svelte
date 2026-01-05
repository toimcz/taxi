<script lang="ts">
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: number | string;
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	disabled?: boolean;
	error?: string[] | undefined;
	setValue?: (v: number) => void;
};

let {
	id,
	label,
	value = $bindable(""),
	placeholder,
	name,
	disabled = false,
	min,
	max,
	step,
	error,
	setValue,
}: Props = $props();

function setInputValue(e: Event) {
	value = Number((e.target as HTMLInputElement).value) || 0;
	error = undefined;
	setValue?.(value);
}
</script>

<Input {id} {label} {error}>
  <input
    {id}
    type="number"
    bind:value
    {placeholder}
    class="form-control"
    {name}
    {disabled}
    {min}
    {max}
    {step}
    oninput={setInputValue}
  />
</Input>
