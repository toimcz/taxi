<script lang="ts">
import { Spinner } from "@taxi/ui";
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";

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
