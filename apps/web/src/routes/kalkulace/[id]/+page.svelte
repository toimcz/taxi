<script lang="ts">
import { Card, text } from "@taxi/shared";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import Car from "$lib/components/Car/Car.svelte";
import { GoogleMap } from "$lib/components/Map/index.js";
import { WebPage } from "$lib/components/WebPage/index.js";

let { data } = $props();
let { quote } = $derived(data);

const title = "Kalkulace";
const description = "Kalkulace";
</script>

<WebPage {title} {description}>
  <div class="container">
    <div
      class="flex w-full flex-col gap-8 pt-2"
      data-sveltekit-preload-data="tap"
    >
      <div class="flex w-full flex-wrap justify-center gap-4">
        <Card class="flex w-full flex-col gap-3 lg:max-w-[320px]">
          <h1 class="text-xl font-bold">Kalkulace jízdy</h1>
          <div>
            <p class="detail-title">Odkud:</p>
            <p>{quote.from.label}</p>
          </div>
          <div>
            <p class="detail-title">Kam:</p>
            <p>{quote.to.label}</p>
          </div>
          <div>
            <p class="detail-title">Vzdálenost:</p>
            <p>{quote.distance} km</p>
          </div>
          <div>
            <p class="detail-title">Přibližný čas jízdy:</p>
            <p>{text.duration(quote.duration)}</p>
          </div>
          <div>
            <p class="detail-title">Datum:</p>
            <p>{quote.pickup.human}</p>
          </div>
          <div>
            <p class="detail-title">Počet osob:</p>
            <p>{quote.pax}</p>
          </div>
        </Card>
        {#each quote.cars as car (car.id)}
          <div class="w-full lg:max-w-[320px]">
            <Car bookingId={quote.id} {car} />
          </div>
        {/each}
      </div>
      <GoogleMap
        apiKey={PUBLIC_GOOGLE_API_KEY}
        from={quote.from}
        to={quote.to}
      />
    </div>
  </div>
</WebPage>

<style lang="postcss">
  @reference 'tailwindcss';

  .detail-title {
    @apply text-sm text-blue-800;
  }
</style>
