<script lang="ts">
import { cn } from "@taxi/shared";
import type { Snippet } from "svelte";
import { Spinner } from "../Icons/index.js";

type Props = {
	class?: string;
	children: Snippet;
	processing: boolean;
};

let { class: className = "", children, processing }: Props = $props();
</script>

<button
  type="submit"
  class={cn("btn btn-primary", className)}
  disabled={processing}
>
  {#if processing}
    <Spinner />
  {:else}
    {@render children?.()}
  {/if}
</button>
