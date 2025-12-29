<script lang="ts">
import { Card } from "@taxi/ui";
import { cn } from "@taxi/utils";
import { WebPage } from "$lib/components";

const title = "Základna";
const description = "Základna";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full">
    <div class="mb-3 flex items-center justify-between gap-x-6">
      <h1 class="text-xl font-bold">{title}</h1>
      <a href="/zakladny" class="btn btn-light btn-sm">Zpět</a>
    </div>
    <div class="mt-5 grid grid-cols-1 gap-y-4">
      <div>
        <div class="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            Město: <span class="text-primary pl-4">{data.base.city}</span>
          </div>
          <div>
            Země: <span class="text-primary pl-4">{data.base.country}</span>
          </div>
          <div>
            Koeficient:
            <span class="text-primary pl-4">{data.base.koeficient.toFixed(2)}</span>
          </div>
          <div>
            Síla: <span class="text-primary pl-4">{data.base.strength} km</span>
          </div>
          <div>
            Status:
            <span class="text-primary pl-4">{data.base.status ? 'Aktivní' : 'Neaktivní'}</span>
          </div>
        </div>
        <div class="flex gap-x-4">
          <a class="btn btn-primary btn-sm" href="/zakladny/{data.base.id}/edit"> Upravit </a>
          <a class="btn btn-primary btn-sm" href="/zakladny/{data.base.id}/vozy/novy">
            Přidat vůz
          </a>
        </div>
      </div>
      <hr />
      <div class="w-full overflow-x-auto">
        <div class="datatable">
          <div class="tr">
            <div class="th">Název</div>
            <div class="th">Vozy</div>
            <div class="th">Max osob</div>
            <div class="th">Max zavazadel</div>
            <div class="th">Cena km</div>
            <div class="th">Min. cena</div>
            <div class="th">Zák. cena</div>
            <div class="th">Cena za osobu</div>
            <div class="th">Depozit</div>
            <div class="th">Dynamika</div>
          </div>
          {#each data.base.cars as car (car.id)}
            <a
              class={cn('tr', {
                'text-red-500': !car.status,
              })}
              href="/zakladny/{data.base.id}/vozy/{car.id}"
            >
              <div class="td">{car.name}</div>
              <div class="td">{car.types.slice(0, 23)}</div>
              <div class="td">{car.pax}</div>
              <div class="td">{car.luggage}</div>
              <div class="td">{car.priceKm} Kč</div>
              <div class="td">{car.minPrice} Kč</div>
              <div class="td">{car.basePrice} Kč</div>
              <div class="td">{car.perPerson ? 'Ano' : 'Ne'}</div>
              <div class="td">{car.deposit ? 'Ano' : 'Ne'}</div>
              <div class="td">{car.surge ? 'Ano' : 'Ne'}</div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </Card>
</WebPage>
