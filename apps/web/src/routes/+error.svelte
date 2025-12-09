<script lang="ts">
import { page } from "$app/state";
import { WebPage } from "$lib/components/WebPage";
</script>

<WebPage title="Error" description="Error page">
  <div class="container">
    <h1 class="text-primary text-2xl font-bold" class:text-red-500={page.status >= 400}>{page?.status || ""} {page.error?.message || "Unknown error"}</h1>
  </div>
</WebPage>
