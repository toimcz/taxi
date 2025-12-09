<script lang="ts">
import type { Snippet } from "svelte";

type Props = {
	id: string;
	label: string;
	children: Snippet;
	error?: string[] | undefined;
};

const { id, label, children, error }: Props = $props();
</script>

<div class="relative mb-1">
	<div class="form-group" class:error={error?.length}>
		<label for={id}>{label}</label>
		{@render children?.()}
	</div>
	{#if error?.length}
		<div class="absolute left-2 top-full text-xs text-red-500">
			{error.join(', ')}
		</div>
	{/if}
</div>
