<script lang="ts">
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	disabled?: boolean;
	error?: string[] | undefined;
	setValue?: (value: number) => void;
};

let {
	id,
	label,
	value = $bindable(),
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
	const v = Number((e.target as HTMLInputElement).value) || 0;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <div class="form-control flex items-center gap-2">
    <input
      {id}
      type="number"
      bind:value
      {placeholder}
      {name}
      {disabled}
      {min}
      {max}
      {step}
      oninput={setInputValue}
    />
    <span class="text-gray-500">Kč</span>
  </div>
</Input>
