<script lang="ts">
import { Card, WebPage } from "@taxi/shared";

let title = "Státy";
let description = "Seznam států";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Státy</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Stát</div>
        <div class="th">Koeficient</div>
        <div class="th">Nakládka</div>
        <div class="th">Vykládka</div>
        <div class="th">Kabotáž</div>
        <div class="th">Status</div>
      </div>
      {#if data.countries}
        {#each data.countries as country (country.id)}
          <a href="/staty/{country.id}" class="tr">
            <div class="td">{country.name}</div>
            <div class="td">{country.koeficient}</div>
            <div
              class="td"
              class:text-emerald-600={country.from}
              class:text-danger={!country.from}
            >
              {country.from ? "Ano" : "Ne"}
            </div>
            <div
              class="td"
              class:text-emerald-600={country.to}
              class:text-danger={!country.to}
            >
              {country.to ? "Ano" : "Ne"}
            </div>
            <div
              class="td"
              class:text-emerald-600={country.in}
              class:text-danger={!country.in}
            >
              {country.in ? "Ano" : "Ne"}
            </div>
            <div
              class="td"
              class:text-emerald-600={country.status}
              class:text-danger={!country.status}
            >
              {country.status ? "Aktivní" : "Neaktivní"}
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </Card>
  <div class="grid grid-cols-1 gap-y-1 lg:hidden">
    {#each data.countries as country (country.id)}
      <a href="/staty/{country.id}" class="flex justify-between gap-x-2">
        <div>{country.name}</div>
        <div>
          <span class="pr-1">{country.koeficient.toFixed(2)}</span>
          <span
            class:text-success={country.from}
            class:text-danger={!country.from}>N</span
          >
          <span class:text-success={country.to} class:text-danger={!country.to}
            >V</span
          >
          <span class:text-success={country.in} class:text-danger={!country.in}
            >K</span
          >
        </div>
      </a>
    {/each}
    <div class="pt-2 text-center text-sm">
      N - nakládka V - vykládka K - kabotáž
    </div>
  </div>
</WebPage>
