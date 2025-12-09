<script lang="ts">
// Import 1
import "@fontsource-variable/geologica";
import "@fontsource/audiowide";
// Import 2
import "$lib/css/app.css";
// Import 3
import { ProgressBar } from "@prgm/sveltekit-progress-bar";
import { Sidebar } from "$lib/components/Sidebar";
import Toast from "$lib/components/Toast/Toast.svelte";
import { setToastStore } from "$lib/stores";

setToastStore();

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
