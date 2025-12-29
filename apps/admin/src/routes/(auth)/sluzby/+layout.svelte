<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Služby",
		href: "/sluzby",
	},
	{
		name: "Nová služba",
		href: "/sluzby/nova",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
