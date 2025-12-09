<script lang="ts">
import type { Snippet } from "svelte";

type Props = {
	id: string;
	label: string;
	error?: boolean;
	children: Snippet;
};

let { id, label, children, error = false }: Props = $props();
</script>

<div
  class="bg-two relative flex flex-col gap-1 rounded-xl border border-transparent px-3 py-1 focus-within:shadow-md"
  class:!border-red-500={error}
>
  <label for={id} class="pt-0.5 text-sm text-gray-600">{label}</label>
  {@render children?.()}
</div>

<style>
  label {
    transition: color 0.2s ease-in-out;
  }

  div:focus-within label {
    color: var(--color-primary);
  }
</style>
