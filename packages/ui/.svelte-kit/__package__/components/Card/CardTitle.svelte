<script lang="ts">
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type Props = {
	tag: keyof SvelteHTMLElements;
	class?: string;
	children: Snippet;
};

const {
	tag,
	class: className = "text-xl font-bold mb-5",
	children,
}: Props = $props();
</script>

<svelte:element this={tag} class={className}>{@render children?.()}</svelte:element>
<hr />
