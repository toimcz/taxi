<script lang="ts">
import type { Role } from "@taxi/contracts/common";
import { page } from "$app/state";

type Props = {
	links: {
		name: string;
		href: string;
		role?: Role[];
	}[];
};

let { links }: Props = $props();
</script>

<nav class="bg-one flex items-center gap-x-3 rounded-2xl px-6 py-3">
  {#each links as { name, href, role }, i (i)}
    {#if !role || role.some((r) => page.data.auth?.role?.includes(r))}
      <a {href} class="btn btn-link" class:btn-link-active={href === page.url.pathname}>{name}</a>
    {/if}
  {/each}
</nav>
