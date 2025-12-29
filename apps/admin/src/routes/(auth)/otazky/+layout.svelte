<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Otázky",
		href: "/otazky",
	},
	{
		name: "Nová otázka",
		href: "/otazky/nova",
	},
	{
		name: "Kategorie",
		href: "/otazky/kategorie",
	},
	{
		name: "Nová kategorie",
		href: "/otazky/kategorie/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
