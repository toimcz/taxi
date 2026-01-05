<script lang="ts">
import type { Snippet } from "svelte";

type Props = {
	title: string;
	href: string;
	children: Snippet;
};

const { href, title, children }: Props = $props();
</script>

<a
  {href}
  {title}
  class="rounded-base overflow-hidden bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
>
  {@render children()}
</a>
