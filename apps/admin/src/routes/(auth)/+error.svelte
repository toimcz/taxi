<script lang="ts">
import { ChevronDown, ChevronUp, House, TriangleAlert } from "@lucide/svelte";
import { Card, WebPage } from "@taxi/shared";
import { page } from "$app/state";

let cause = $derived(page.error?.cause);
let showDetails = $state(false);

const status = $derived(page.status);
const message = $derived(page.error?.message ?? "Neočekávaná chyba");

function toggleDetails() {
	showDetails = !showDetails;
}
</script>

<WebPage title={`Chyba ${status}`} description={message}>
  <div class="flex min-h-[60vh] items-center justify-center p-4">
    <Card class="w-full max-w-lg text-center">
      <div class="mb-6 flex justify-center">
        <div class="bg-red-50 rounded-full p-4">
          <TriangleAlert class="text-red-500 h-12 w-12" />
        </div>
      </div>

      <h1 class="text-gray-900 mb-2 text-4xl font-bold">{status}</h1>
      <p class="text-gray-600 mb-8 text-xl">{message}</p>

      <div class="mb-6 flex justify-center">
        <a
          href="/"
          class="bg-black hover:bg-gray-800 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-white transition-colors"
        >
          <House class="h-4 w-4" />
          Zpět na hlavní stránku
        </a>
      </div>

      {#if cause}
        <div class="mt-6 border-t pt-4 text-left">
          <button
            class="text-gray-500 hover:text-gray-700 flex w-full items-center gap-2 text-sm"
            onclick={toggleDetails}
          >
            {#if showDetails}
              <ChevronUp class="h-4 w-4" />
            {:else}
              <ChevronDown class="h-4 w-4" />
            {/if}
            Technické detaily
          </button>

          {#if showDetails}
            <pre
              class="bg-gray-50 text-gray-700 mt-4 overflow-x-auto rounded-lg p-4 font-mono text-xs">
              {JSON.stringify(cause, null, 2)}
            </pre>
          {/if}
        </div>
      {/if}
    </Card>
  </div>
</WebPage>
