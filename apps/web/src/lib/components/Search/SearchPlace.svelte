<script lang="ts">
import { MapPin } from "@lucide/svelte";
import { Autocomplete } from ".";
import SearchInput from "./SearchInput.svelte";

type Props = {
	id: string;
	name: string;
	value: string;
	placeId?: string;
	error?: boolean;
};

let { id, name, value = $bindable(""), placeId = $bindable(), error = false }: Props = $props();

function setValue(v: string) {
	value = v;
	error = false;
}

function setPlaceId(pi: string) {
	placeId = pi;
	error = false;
}
</script>

<SearchInput id="from" label="Odkud" {error}>
  <div class="flex w-full items-center gap-2">
    <MapPin size={16} class="text-slate-500" />
    <div class="flex-1">
      <Autocomplete
        {id}
        {name}
        {value}
        {placeId}
        placeholder="Zadejte město, adresu, letiště, hotel..."
        {setValue}
        {setPlaceId}
      />
    </div>
  </div>
</SearchInput>
<input id={`${name}-place-id`} type="hidden" name={`${name}PlaceId`} value={placeId} />
