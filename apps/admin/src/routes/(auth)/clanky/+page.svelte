<script>
import { Card, WebPage } from "@taxi/shared";

const title = "Články";
const description = "Správa článků";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">Články</h1>
    <hr />
    {#if data.posts.length > 0}
      <div class="datatable">
        <div class="tr">
          <div class="th">Název</div>
          <div class="th">Kategorie</div>
          <div class="th">Stav</div>
        </div>
        {#each data.posts as post (post.id)}
          <a href="/clanky/{post.id}" class="tr" class:inactive={!post.public}>
            <div class="td">{post.title}</div>
            <div class="td">{post.categoryName}</div>
            <div class="td">{post.public ? "Aktivní" : "Neaktivní"}</div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center">Žádné články</div>
    {/if}
  </Card>
</WebPage>

<style>
  .inactive .td {
    color: #df3551;
  }
</style>
