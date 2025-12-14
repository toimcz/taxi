<script lang="ts">
import { Spinner } from "@taxi/ui";
import { cn } from "@taxi/utils";
import type { Snippet } from "svelte";

type Props = {
	class?: string;
	children: Snippet;
	processing: boolean;
};

let { class: className = "", children, processing }: Props = $props();
</script>

<button type="submit" class={cn('btn btn-primary', className)} disabled={processing}>
  {#if processing}
    <Spinner />
  {:else}
    {@render children?.()}
  {/if}
</button>
