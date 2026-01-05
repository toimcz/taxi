<script lang="ts">
import { Navbar } from "$lib/components";

let { children } = $props();

const links = [
	{
		name: "Poslední",
		href: "/platby",
	},
];
</script>

<div class="flex flex-col gap-4">
	<Navbar {links} />
	{@render children?.()}
</div>
