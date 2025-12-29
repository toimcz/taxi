<script lang="ts">
import { debounce } from "@taxi/utils";
import { v7 as uuidv7 } from "uuid";
import { clickOutside } from "$lib/actions";

export interface AutocompleteSuggestion {
	placePrediction: {
		placeId: string;
		text: {
			text: string;
		};
		structuredFormat: {
			mainText: {
				text: string;
			};
			secondaryText: {
				text: string;
			};
		};
		types: string[];
	};
}

type Props = {
	id: string;
	name: string;
	placeholder?: string;
	value?: string;
	placeId?: string;
	focus?: boolean;
	error?: boolean;
	setValue: (v: string) => void;
	setPlaceId: (v: string) => void;
};

let {
	id,
	name,
	placeholder,
	value = "",
	placeId = "",
	focus,
	error,
	setValue,
	setPlaceId,
}: Props = $props();

const sessionToken = uuidv7();

let places = $state<AutocompleteSuggestion[]>([]);

function search(e: Event) {
	const target = e.target as HTMLInputElement;
	if (target) {
		debouncedFetchPlaces(target.value);
	}
}

const resetAutocomplete = () => {
	setPlaceId("");
	setValue("");
	places = [];
};

const fetchPlaces = async (query: string) => {
	if (query.length < 3) return;
	try {
		const response = await fetch(
			`/api/web/places/autocomplete?query=${encodeURIComponent(query)}&sessionToken=${sessionToken}`,
		);

		if (!response.ok) {
			console.error("Failed to fetch places:", response.status);
			return;
		}

		const data = await response.json();
		places = data;
	} catch (error) {
		console.error("Error fetching places:", error);
		places = [];
	}
};
const debouncedFetchPlaces = debounce(fetchPlaces, 400);

function handlePlaceClick(place: AutocompleteSuggestion) {
	setPlaceId(place.placePrediction.placeId);
	setValue(place.placePrediction.text.text);
	places = [];
}
</script>

<div
  use:clickOutside
  onclickoutside={() => {
    places = [];
  }}
>
  <input
    {id}
    type="search"
    {name}
    {placeholder}
    {value}
    class="w-full"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    tabindex={focus ? 0 : -1}
    aria-autocomplete="list"
    aria-controls="combo-listbox"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-invalid={error ? 'true' : undefined}
    role="combobox"
    onfocus={resetAutocomplete}
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}
    oninput={search}
  />
  <input id={`${id}-place-id`} type="hidden" name={`${name}PlaceId`} value={placeId} />
  {#if places.length > 0}
    <div
      class="suggestions rounded-base absolute left-0 top-full z-10 max-h-[300px] w-full overflow-y-auto px-5 py-2 shadow-xl"
    >
      <ul>
        {#each places as place, i (i)}
          <li>
            <button
              type="button"
              class="hover:bg-one w-full border-b border-gray-200 py-1 text-left"
              onclick={() => handlePlaceClick(place)}
            >
              <div class="flex flex-col">
                <div class="font-medium">
                  {place.placePrediction.structuredFormat.mainText.text}
                </div>
                <div class="text-sm text-gray-400">
                  {place.placePrediction.structuredFormat.secondaryText.text}
                </div>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .suggestions {
    background-color: white;
  }

  ul li:last-child button {
    border-bottom: none !important;
  }
</style>
