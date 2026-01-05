<script lang="ts">
import { Calendar } from "@lucide/svelte";
import { Datepicker } from "@taxi/shared";
import SearchInput from "./SearchInput.svelte";

type Props = {
	id: string;
	name: string;
	value: string;
	error?: boolean;
};

let { id, name, value = $bindable(""), error = false }: Props = $props();

function setDate(v: string) {
	value = v;
	error = false;
}
</script>

<SearchInput {id} label="Datum" {error}>
  <div class="flex w-full items-center gap-2">
    <Calendar size={16} class="text-slate-500" />
    <div class="flex-1">
      <Datepicker
        {id}
        {name}
        {value}
        minDate={new Date()}
        placeholder="Vyberte datum"
        {setDate}
      />
    </div>
  </div>
</SearchInput>
