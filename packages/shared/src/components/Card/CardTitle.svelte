<script lang="ts">
import { cn } from "@taxi/shared";
import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type Props = {
	tag: keyof SvelteHTMLElements;
	class?: string;
	children: Snippet;
};

const { tag, class: className, children }: Props = $props();
</script>

<svelte:element this={tag} class={cn('text-xl font-bold mb-5', className)}
  >{@render children?.()}</svelte:element
>
<hr />
