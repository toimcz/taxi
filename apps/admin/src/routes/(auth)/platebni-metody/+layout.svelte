<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Platební metody",
		href: "/platebni-metody",
	},
	{
		name: "Nová platební metoda",
		href: "/platebni-metody/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
  <Navbar {links} />
  {@render children?.()}
</div>
