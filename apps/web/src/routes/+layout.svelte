<script lang="ts">
// Import 1
import "@fontsource-variable/geologica";
import "@fontsource/audiowide";
// Import 2
import "$lib/css/app.css";
import { Footer, Navbar, setToastStore, Toast } from "@taxi/shared";
// Import 3
import favicon from "$lib/assets/favicon.svg";
import { setSearchStore } from "$lib/stores/index.js";

let { children, data } = $props();

setToastStore();
setSearchStore();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="relative mx-auto flex min-h-screen w-full flex-col">
  <Navbar pages={data.topPages} />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer pages={data.bottomPages} />
  <Toast />
</div>
