<script lang="ts">
import { Info } from "@lucide/svelte";
import type { Snippet } from "svelte";
import Tooltip from "../../Tooltip/Tooltip.svelte";

type Props = {
	id: string;
	label: string;
	children: Snippet;
	error?: string[] | undefined;
};

const { id, label, children, error }: Props = $props();
</script>

<div>
  <div class="form-group" class:error={error?.length}>
    <label for={id}>{label}</label>
    {@render children?.()}

    {#if error?.length}
      <div class="absolute top-1 right-1">
        <Tooltip content={error.join(', ')}>
          <Info size={16} class="text-red-500" />
        </Tooltip>
      </div>
    {/if}
  </div>
</div>
