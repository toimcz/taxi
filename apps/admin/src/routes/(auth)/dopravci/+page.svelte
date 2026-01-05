<script lang="ts">
import { Card, WebPage } from "@taxi/shared";

let title = "Dopravci";
let description = "Seznam dopravců";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Dopravci</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Název</div>
        <div class="th">Email</div>
        <div class="th">Telefon</div>
        <div class="th">Status</div>
      </div>
      {#each data.partners as partner (partner.id)}
        <a href="/dopravci/{partner.id}/detail" class="tr">
          <div class="td">{partner.name}</div>
          <div class="td">{partner.email}</div>
          <div class="td">{partner.phone}</div>
          <div class="td">
            <span
              class:!text-success={partner.status}
              class:!text-danger={!partner.status}
            >
              {partner.status ? "Aktivní" : "Neaktivní"}
            </span>
          </div>
        </a>
      {/each}
    </div>
    <div class="grid grid-cols-1 gap-y-1 lg:hidden">
      {#each data.partners as partner (partner.id)}
        <a
          href="/dopravci/{partner.id}/detail"
          class="flex justify-between gap-x-2"
        >
          <div>{partner.name}</div>
          <div>
            <span class="pr-1">{partner.email}</span>
            <span class="pr-1">{partner.phone}</span>
            <span
              class:!text-success={partner.status}
              class:!text-danger={!partner.status}
            >
              {partner.status ? "Ano" : "Ne"}
            </span>
          </div>
        </a>
      {/each}
    </div>
  </Card>
</WebPage>
