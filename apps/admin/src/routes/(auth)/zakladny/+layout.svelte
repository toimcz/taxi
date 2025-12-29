<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Základny",
		href: "/zakladny",
	},
	{
		name: "Nová základna",
		href: "/zakladny/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
