<script lang="ts">
  import { MoveVertical } from '@lucide/svelte';
  import { enhance } from '$app/forms';
  import { SubmitButton } from '$lib/components/Button';
  import { SearchDate, SearchPassengers, SearchPlace, SearchTime } from '$lib/components/Search';
  import { useForm } from '$lib/hooks/use-form.svelte';
  import { useSearchStore } from '$lib/stores/search.svelte';

  const searchStore = useSearchStore();

  const { submit, issues, processing } = useForm({
    onSuccess() {
      console.log('test');
    },
  });
</script>

<div class="container">
  <div class="rounded-base w-full bg-white px-8 py-4 shadow-lg">
    <p class="text-primary mb-2 text-xl font-bold">Kam to bude?</p>
    <form method="POST" class="grid grid-cols-1 gap-4 xl:grid-cols-7" use:enhance={submit}>
      <div class="col-span-1 xl:col-span-3">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div class="relative">
            <SearchPlace
              id="from"
              name="from"
              bind:value={searchStore.from}
              bind:placeId={searchStore.fromPlaceId}
              error={!!issues.from}
            />
            <button
              type="button"
              class="absolute right-2 top-14 z-10 rounded-full border border-slate-300 bg-slate-200 p-1 lg:-right-5 lg:top-4 lg:rotate-90"
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
              error={!!issues.to}
            />
          </div>
        </div>
      </div>
      <div class="col-span-1 xl:col-span-3">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SearchDate id="date" name="date" bind:value={searchStore.date} error={!!issues.date} />
          <SearchTime id="time" name="time" bind:value={searchStore.time} error={!!issues.time} />
          <SearchPassengers
            id="passengers"
            bind:adults={searchStore.adults}
            bind:children={searchStore.children}
            bind:infants={searchStore.infants}
            error={!!issues.adults || !!issues.children || !!issues.infants}
          />
        </div>
      </div>
      <div class="col-span-1 xl:col-span-1">
        <SubmitButton
          class="h-full w-full min-h-12 mt-0! rounded-xl bg-orange-400 px-8 py-2 font-semibold uppercase text-white hover:scale-105"
          processing={processing()}
        >
          Zjistit cenu
        </SubmitButton>
      </div>
    </form>
  </div>
</div>
