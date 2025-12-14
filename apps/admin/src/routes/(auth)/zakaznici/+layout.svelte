<script lang="ts">
import Navbar from "$lib/components/Navbar/Navbar.svelte";

let { children } = $props();

const links = [
	{
		name: "Zákazníci",
		href: "/zakaznici",
	},
	{
		name: "Nový zákazník",
		href: "/zakaznici/novy",
	},
];
</script>

<div class="flex flex-col gap-4">
  <Navbar {links} />
  {@render children?.()}
</div>
