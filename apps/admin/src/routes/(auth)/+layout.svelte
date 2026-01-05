<script>
import { ProgressBar } from "@prgm/sveltekit-progress-bar";
import { Toast } from "@taxi/shared";
import { Sidebar } from "$lib/components";

let { children } = $props();
</script>

<ProgressBar class="text-blue-300" />
<div class="content" data-sveltekit-preload-data="tap">
  <Sidebar />
  <main class="bg-body w-full flex-1 overflow-x-scroll px-3 py-2">
    {@render children?.()}
  </main>
</div>
<Toast />
