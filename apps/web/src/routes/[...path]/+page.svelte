<script lang="ts">
import { WebPage } from "@taxi/shared";

let { data } = $props();
const title = $derived(data.page.title);
const description = $derived(data.page.description);
</script>

<WebPage {title} {description}>
  <div class="container bg-white px-10 py-5 rounded-xl">
    <div class="post-content flex flex-col gap-4">
      <h1>{data.page.title}</h1>
      <hr class="border-primary border-2 my-2! w-full border-t-2" />
      <div class="prose">
        {@html data.page.content}
      </div>
    </div>
  </div>
</WebPage>
