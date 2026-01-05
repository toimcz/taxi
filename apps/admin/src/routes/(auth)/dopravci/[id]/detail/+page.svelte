<script lang="ts">
import { Card, WebPage } from "@taxi/shared";

let { data } = $props();

const title = $derived(`Dopravce: ${data.partner?.name || "..."}`);
const description = $derived(`Detail dopravce ${data.partner?.name || "..."}`);
</script>

<WebPage {title} {description}>
  {#if data.partner}
    <div class="flex flex-col gap-4">
      <div class="flex justify-between gap-4">
        <div class="flex items-center gap-6">
          <h1 class="text-2xl font-bold">{data.partner.name}</h1>
          <p>Email: {data.partner.email || "-"}</p>
          <p>Telefon: {data.partner.phone || "-"}</p>
        </div>
        <div>
          <a href="/dopravci/{data.partner.id}" class="btn btn-light">Upravit</a
          >
        </div>
      </div>
      <Card>
        <div class="flex items-center justify-between gap-x-3">
          <h2 class="text-lg font-bold">Řidiči</h2>
          <a
            href="/dopravci/{data.partner.id}/ridici/novy"
            class="btn btn-light">Přidat řidiče</a
          >
        </div>
        <div class="datatable mt-3">
          <div class="tr">
            <div class="td">Jméno</div>
            <div class="td">Email</div>
            <div class="td">Telefon</div>
          </div>
          {#each data.partner.drivers as driver (driver.id)}
            <a href="/dopravci/{data.partner.id}/ridici/{driver.id}" class="tr">
              <div class="td">{driver.fullName}</div>
              <div class="td">{driver.email}</div>
              <div class="td">{driver.phone}</div>
            </a>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</WebPage>
