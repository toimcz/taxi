<script>
import { Card, WebPage } from "@taxi/shared";
import { page } from "$app/state";

let { data } = $props();

const title = "Nastavení";
const description = "Správa nastavení";
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Nastavení</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Název</div>
        <div class="th">Popis</div>
        <div class="th">Hodnota</div>
        {#if page.data.auth?.role === "DEV"}
          <div class="th">Hodnota pro vývoj</div>
        {/if}
      </div>
      {#each data.settings as setting (setting.id)}
        <a href="/nastaveni/{setting.id}" class="tr">
          <div class="td">{setting.key}</div>
          <div class="td">{setting.description}</div>
          <div class="td">{setting.value}</div>
          {#if page.data.auth?.role === "DEV"}
            <div class="td">{setting.devValue}</div>
          {/if}
        </a>
      {/each}
    </div>
  </Card>
</WebPage>
