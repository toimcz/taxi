<script lang="ts">
import Logo from "./Logo.svelte";

type Props = {
	href: string;
	src: string;
	text?: string;
};

const { href, src, text }: Props = $props();
</script>

<div class="flex items-center gap-2">
  <Logo {src} />
  <a {href} class="text-2xl font-bold">{text}</a>
</div>
