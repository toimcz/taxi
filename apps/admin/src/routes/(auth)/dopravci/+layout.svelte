<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Dopravci",
		href: "/dopravci",
	},
	{
		name: "Nový dopravce",
		href: "/dopravci/novy",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
