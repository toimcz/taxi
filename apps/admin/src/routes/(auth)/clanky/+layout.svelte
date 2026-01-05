<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Články",
		href: "/clanky",
	},
	{
		name: "Nový článek",
		href: "/clanky/novy",
	},
	{
		name: "Kategorie",
		href: "/clanky/kategorie",
	},
	{
		name: "Nová kategorie",
		href: "/clanky/kategorie/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
