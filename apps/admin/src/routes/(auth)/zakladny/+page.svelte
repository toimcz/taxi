<script lang="ts">
import { CirclePlus } from "@lucide/svelte";
import { Card, WebPage } from "@taxi/shared";
import { page } from "$app/state";

let title = "Základny";
let description = "Seznam základen";

let { data } = $props();
let bases = $derived(data.bases.data);
let total = $derived(data.bases.meta?.total ?? 0);
</script>

<WebPage {title} {description}>
  <Card>
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">Základny</h1>
      <div class="flex items-center gap-x-3">
        <div class="text-slate-600">Počet: {total}</div>
        {#if page.data.user?.roles.includes("dev")}
          <a href="/zakladny/nova" class="flex items-center">
            <CirclePlus size={20} class="text-blue-600 hover:text-blue-500" />
          </a>
        {/if}
      </div>
    </div>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Město</div>
        <div class="th">Stát</div>
        <div class="th">Koeficient</div>
        <div class="th">Síla km</div>
        <div class="th">Status</div>
      </div>
      {#each bases as base (base.id)}
        <a href="/zakladny/{base.id}" class="tr">
          <div class="td">{base.city}</div>
          <div class="td">{base.country}</div>
          <div class="td">{base.koeficient}</div>
          <div class="td">{base.strength} km</div>
          <div
            class="td"
            class:text-success={base.status}
            class:text-danger={!base.status}
          >
            {base.status ? "Aktivní" : "Neaktivní"}
          </div>
        </a>
      {/each}
    </div>
    <div class="grid grid-cols-1 gap-y-1 lg:hidden">
      {#each bases as base (base.id)}
        <a href="/zakladny/{base.id}" class="flex justify-between gap-x-2">
          <div>{base.city}</div>
          <div
            class:text-success={base.status}
            class:text-danger={!base.status}
          >
            {base.status ? "Aktivní" : "Neaktivní"}
          </div>
        </a>
      {/each}
    </div>
  </Card>
</WebPage>
