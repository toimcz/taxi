<script lang="ts">
import { Timer } from "@lucide/svelte";
import SearchInput from "./SearchInput.svelte";

type Props = {
	id: string;
	name: string;
	value: string;
	error?: boolean;
};

let { id, name, value = $bindable(""), error = false }: Props = $props();

const setTime = (v: string) => {
	value = v;
	error = false;
};

function handleTimeChange(event: Event) {
	const target = event.target as HTMLInputElement;
	setTime(target.value);
}
</script>

<SearchInput {id} label="Čas odjezdu/příletu" {error}>
  <div class="flex w-full items-center gap-2">
    <Timer size={16} class="text-slate-500" />
    <div class="flex-1">
      <input type="time" {id} {value} oninput={handleTimeChange} {name} class="w-auto text-left" />
    </div>
  </div>
</SearchInput>

<style>
  input[type='time'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: auto;
  }
</style>
