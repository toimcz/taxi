<script>
import { Card } from "@taxi/ui";
import { WebPage } from "$lib/components";

let { data } = $props();

const title = "Služby";
const description = "Správa služeb";
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Služby</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Název</div>
      </div>
      {#each data.services as service (service.id)}
        <a href="/sluzby/{service.id}" class="tr">
          <div class="td">{service.title}</div>
        </a>
      {/each}
    </div>
  </Card>
</WebPage>
