<script>
import { Card, WebPage } from "@taxi/shared";

const title = "Otázky";
const description = "Správa otázek";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Otázky</h1>
    <hr />
    {#if data.questions.length > 0}
      <div class="datatable">
        <div class="tr">
          <div class="th">Otázka</div>
          <div class="th">Kategorie</div>
          <div class="th">Stav</div>
        </div>
        {#each data.questions as question (question.id)}
          <a
            href="/otazky/{question.id}"
            class="tr"
            class:inactive={!question.status}
          >
            <div class="td">{question.question}</div>
            <div class="td">{question.categoryName}</div>
            <div class="td">{question.status ? "Aktivní" : "Neaktivní"}</div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center">Žádné otázky</div>
    {/if}
  </Card>
</WebPage>

<style>
  .inactive .td {
    color: #df3551;
  }
</style>
