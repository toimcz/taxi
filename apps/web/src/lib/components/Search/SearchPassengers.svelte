<script lang="ts">
import { CircleMinus, CirclePlus, Users } from "@lucide/svelte";
import { onMount } from "svelte";
import SearchInput from "./SearchInput.svelte";

type Props = {
	id: string;
	adults: number;
	children: number;
	infants: number;
	error?: boolean;
};

let {
	id,
	adults = $bindable(0),
	children = $bindable(0),
	infants = $bindable(0),
	error = false,
}: Props = $props();

let showPassengers = $state(false);

$effect(() => {
	if (adults || children || infants) {
		error = false;
	}
});

let adultesText = $derived(() => {
	switch (adults) {
		case 1:
			return "dospělý";
		case 2:
		case 3:
		case 4:
			return "dospělí";
		default:
			return "dospělých";
	}
});

let childrenText = $derived(() => {
	switch (children) {
		case 1:
			return "dítě";
		case 2:
		case 3:
		case 4:
			return "děti";
		default:
			return "dětí";
	}
});

let infantsText = $derived(() => {
	switch (infants) {
		case 1:
			return "batole";
		case 2:
		case 3:
		case 4:
			return "batolata";
		default:
			return "batolat";
	}
});

function togglePassengers() {
	showPassengers = !showPassengers;
}

function decreaseAdults() {
	if (adults > 0) {
		adults--;
	}
}

function increaseAdults() {
	if (adults < 19) {
		adults++;
	}
}

function decreaseChildren() {
	if (children > 0) {
		children--;
	}
}

function increaseChildren() {
	if (children < 19) {
		children++;
	}
}

function decreaseInfants() {
	if (infants > 0) {
		infants--;
	}
}

function increaseInfants() {
	if (infants < 3) {
		infants++;
	}
}

function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target.closest(".passengers-container") && showPassengers) {
		showPassengers = false;
	}
}

onMount(() => {
	document.addEventListener("click", handleClickOutside);
	return () => {
		document.removeEventListener("click", handleClickOutside);
	};
});
</script>

<SearchInput {id} label="Počet osob" {error}>
  <div class="passengers-container relative">
    <div class="flex w-full items-center gap-2">
      <Users size={16} class="text-slate-500" />
      <div class="flex-1">
        <button
          {id}
          type="button"
          class="w-full text-left"
          class:italic={!(adults || children || infants)}
          class:text-sm={!(adults || children || infants)}
          class:text-gray-500={!(adults || children || infants)}
          onclick={togglePassengers}
        >
          {#if !(adults || children || infants)}
            Vyberte
          {:else}
            {adults + children + infants}
          {/if}
        </button>
      </div>
    </div>
    {#if showPassengers}
      <div
        class="bg-two absolute -left-3 top-full mt-3 flex w-[200px] flex-col gap-2 rounded-lg p-2 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-0">
            <p class="text-sm font-bold">{adults} {adultesText()}</p>
            <p class="text-xs">12+</p>
          </div>
          <div class="flex gap-x-2">
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={decreaseAdults}
            >
              <CircleMinus />
            </button>
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={increaseAdults}
            >
              <CirclePlus />
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-0">
            <p class="text-sm font-bold">{children} {childrenText()}</p>
            <p class="text-xs">2-11</p>
          </div>
          <div class="flex gap-x-2">
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={decreaseChildren}
            >
              <CircleMinus />
            </button>
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={increaseChildren}
            >
              <CirclePlus />
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-0">
            <p class="text-sm font-bold">{infants} {infantsText()}</p>
            <p class="text-xs">0-2</p>
          </div>
          <div class="flex gap-x-2">
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={decreaseInfants}
            >
              <CircleMinus />
            </button>
            <button
              type="button"
              class="text-gray-500 hover:text-emerald-400"
              onclick={increaseInfants}
            >
              <CirclePlus />
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</SearchInput>
<input type="hidden" name="adults" value={adults} />
<input type="hidden" name="children" value={children} />
<input type="hidden" name="infants" value={infants} />

<style>
  button {
    touch-action: manipulation;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
