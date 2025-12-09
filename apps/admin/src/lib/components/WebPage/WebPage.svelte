<script lang="ts">
import type { Snippet } from "svelte";

type Props = {
	children: Snippet;
	title: string;
	description: string;
	robots?: string;
};

const {
	title,
	description,
	robots = "index, follow",
	children,
}: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
</svelte:head>

{@render children?.()}
