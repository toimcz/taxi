<script lang="ts">
import { cn } from "@taxi/shared";
import type { Snippet } from "svelte";

type Props = {
	children: Snippet;
	class?: string;
};

const { children, class: className }: Props = $props();
</script>

<div class={cn('card', className)}>
  {@render children?.()}
</div>

<style>
  .card {
    padding: 2rem;
    border-radius: var(--radius-base, 1.2rem);
    background: var(--color-one, #ffffff);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow:
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 3px 0 rgba(0, 0, 0, 0.02);
    transition:
      box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: box-shadow, border-color;
  }

  .card:hover {
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 10px 15px -3px rgba(0, 0, 0, 0.04),
      0 2px 4px -1px rgba(0, 0, 0, 0.02);
  }

  @media (max-width: 768px) {
    .card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 640px) {
    .card {
      padding: 1.25rem;
      border-radius: calc(var(--radius-base, 1.2rem) * 0.85);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
  }
</style>
