<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Stránky",
		href: "/stranky",
	},
	{
		name: "Nová stránka",
		href: "/stranky/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
