<script>
import { Card, WebPage } from "@taxi/shared";

const title = "Kategorie článků";
const description = "Správa kategorií článků";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Kategorie článků</h1>
    <hr />
    {#if data.categories.length > 0}
      <div class="datatable">
        <div class="tr">
          <div class="th">Kategorie</div>
          <div class="th">Stav</div>
        </div>
        {#each data.categories as category (category.id)}
          <a
            href="/clanky/kategorie/{category.id}"
            class="tr"
            class:inactive={!category.status}
          >
            <div class="td">{category.name}</div>
            <div class="td">{category.status ? "Aktivní" : "Neaktivní"}</div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center">Žádné kategorie</div>
    {/if}
  </Card>
</WebPage>

<style>
  .inactive .td {
    color: #df3551;
  }
</style>
