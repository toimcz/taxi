<script lang="ts">
import { Card } from "@taxi/ui";
import { WebPage } from "$lib/components";

let title = "Platební metody";
let description = "Seznam platebních metod";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Platební metody</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Název</div>
        <div class="th">Název v administraci</div>
        <div class="th">Popis</div>
        <div class="th">Provider</div>
        <div class="th">Veřejná</div>
        <div class="th">Status</div>
      </div>
      {#if data.paymentMethods}
        {#each data.paymentMethods as paymentMethod (paymentMethod.id)}
          <a href="/platebni-metody/{paymentMethod.id}" class="tr">
            <div class="td">{paymentMethod.name}</div>
            <div class="td">{paymentMethod.adminName}</div>
            <div class="td">{paymentMethod.description}</div>
            <div class="td">{paymentMethod.provider}</div>
            <div class="td">
              <span
                class:text-success={paymentMethod.public}
                class:text-danger={paymentMethod.public}
              >
                {paymentMethod.public ? "Veřejná" : "Neveřejná"}
              </span>
            </div>
            <div class="td">
              <span
                class:text-success={paymentMethod.status}
                class:text-danger={paymentMethod.status}
              >
                {paymentMethod.status ? "Aktivní" : "Deaktivní"}
              </span>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </Card>
  <div class="grid grid-cols-1 gap-y-1 lg:hidden">
    {#each data.paymentMethods as pm (pm.id)}
      <a href="/platebni-metody/{pm.id}" class="flex justify-between gap-x-2">
        <div>{pm.name}</div>
        <div>
          <span class:text-success={pm.status} class:text-danger={!pm.status}>
            {pm.status ? "Aktivní" : "Deaktivní"}
          </span>
        </div>
      </a>
    {/each}
    <div class="pt-2 text-center text-sm">
      N - nakládka V - vykládka K - kabotáž
    </div>
  </div>
</WebPage>
