<script lang="ts">
import { cn } from "@taxi/utils";
import type { Snippet } from "svelte";

type Props = {
	children: Snippet;
	class?: string;
};

const { children, class: className }: Props = $props();
</script>

<div class={cn('rounded-base bg-one p-6', className)}>
  {@render children?.()}
</div>
