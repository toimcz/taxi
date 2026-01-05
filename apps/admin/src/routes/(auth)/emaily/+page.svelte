<script lang="ts">
import { Card, WebPage } from "@taxi/shared";

let title = "Emaily";
let description = "Poslední odeslané emaily";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Emaily</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th">Datum a čas</div>
        <div class="th">Email</div>
        <div class="th">Předmět</div>
        <div class="th">Stav</div>
      </div>
        {#each data.emails as email (email.id)}
          <a href="/emaily/{email.id}" class="tr">
            <div class="td">{email.createdAt.human}</div>
            <div class="td">{email.email}</div>
            <div class="td">{email.subject}</div>
            <div class="td">{email.status}</div>
          </a>
        {/each}
    </div>
  </Card>
  <div class="grid grid-cols-1 gap-y-1 lg:hidden">
    {#each data.emails as email (email.id)}
      <a href="/emaily/{email.id}" class="flex justify-between gap-x-2">
        <div>{email.createdAt.human}</div>
        <div>
          <span class="pr-1">{email.email}</span>
        </div>
      </a>
    {/each}
  </div>
</WebPage>
