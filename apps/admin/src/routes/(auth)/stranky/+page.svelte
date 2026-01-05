<script>
import { Card, WebPage } from "@taxi/shared";

let { data } = $props();

const title = "Stránky";
const description = "Správa stránek";
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Stránky</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Název</div>
      </div>
      {#each data.pages as page (page.id)}
        <a href="/stranky/{page.id}" class="tr">
          <div class="td">{page.title}</div>
        </a>
      {/each}
    </div>
  </Card>
</WebPage>
