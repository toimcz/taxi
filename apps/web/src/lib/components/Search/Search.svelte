<script lang="ts">
import { MoveVertical } from "@lucide/svelte";
import { QuoteCreateInput } from "@taxi/contracts";
import { enhance } from "$app/forms";
import { goto, invalidateAll } from "$app/navigation";
import { SubmitButton } from "$lib/components/Button";
import { SearchDate, SearchPassengers, SearchPlace, SearchTime } from "$lib/components/Search";
import { useForm } from "$lib/hooks/use-form.svelte";
import { useToastStore } from "$lib/stores";
import { useSearchStore } from "$lib/stores/search.svelte";

const toast = useToastStore();

const searchStore = useSearchStore();

const form = useForm(QuoteCreateInput, {
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Hledání proběhlo úspěšně.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});

function switchPlaces() {
	const from = searchStore.from;
	const fromPlaceId = searchStore.fromPlaceId;
	searchStore.from = searchStore.to;
	searchStore.fromPlaceId = searchStore.toPlaceId;
	searchStore.to = from;
	searchStore.toPlaceId = fromPlaceId;
}
</script>

<div class="container">
  <div class="rounded-base w-full bg-white px-8 py-4 shadow-lg">
    <p class="text-primary mb-2 text-xl font-bold">Kam to bude?</p>
    <form
      method="POST"
      action="/kalkulace"
      class="grid grid-cols-1 gap-4 xl:grid-cols-7"
      use:enhance={form.submit}
    >
      <div class="col-span-1 xl:col-span-3">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div class="relative">
            <SearchPlace
              id="from"
              name="from"
              bind:value={searchStore.from}
              bind:placeId={searchStore.fromPlaceId}
              error={!!form.issues?.from}
            />
            <button
              type="button"
              class="absolute right-2 top-14 z-10 rounded-full border border-slate-300 bg-slate-200 p-1 lg:-right-5 lg:top-4 lg:rotate-90"
              onclick={switchPlaces}
            >
              <MoveVertical size={17} />
            </button>
          </div>
          <div>
            <SearchPlace
              id="to"
              name="to"
              bind:value={searchStore.to}
              bind:placeId={searchStore.toPlaceId}
              error={!!form.issues?.to}
            />
          </div>
        </div>
      </div>
      <div class="col-span-1 xl:col-span-3">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SearchDate
            id="date"
            name="date"
            bind:value={searchStore.date}
            error={!!form.issues?.date}
          />
          <SearchTime
            id="time"
            name="time"
            bind:value={searchStore.time}
            error={!!form.issues?.time}
          />
          <SearchPassengers
            id="passengers"
            bind:adults={searchStore.adults}
            bind:children={searchStore.children}
            bind:infants={searchStore.infants}
            error={!!form.issues?.adults || !!form.issues?.children || !!form.issues?.infants}
          />
        </div>
      </div>
      <div class="col-span-1 xl:col-span-1">
        <SubmitButton
          class="h-full w-full min-h-12 mt-0! rounded-xl bg-orange-400 px-8 py-2 font-semibold uppercase text-white hover:scale-105"
          processing={form.processing}
        >
          Zjistit cenu
        </SubmitButton>
      </div>
    </form>
  </div>
</div>
