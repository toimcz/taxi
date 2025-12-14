<script lang="ts">
// Import 1
import "@fontsource-variable/geologica";
import "@fontsource/audiowide";
// Import 2
import "$lib/css/app.css";
import { setToastStore } from "$lib/stores";

// Import 3

let { children } = $props();
setToastStore();
</script>

{@render children()}
