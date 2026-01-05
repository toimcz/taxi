<script lang="ts">
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: string;
	placeholder?: string;
	error?: string[] | undefined;
	setValue?: (v: string) => void;
};

let { id, label, name, value = $bindable(""), placeholder = "Vyberte čas", error, setValue }: Props = $props();

function handleTimeChange(event: Event) {
	const v = (event.target as HTMLInputElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <input
    type="time"
    id="search-time"
    class="form-control"
    bind:value
    oninput={handleTimeChange}
    {name}
    {placeholder}
  />
</Input>

<style>
  input[type='time'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: auto;
  }
</style>
