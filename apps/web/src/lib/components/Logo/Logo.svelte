<script lang="ts">
import { cn } from "@taxi/utils";

type Props = {
	src: string;
	class?: string;
};

const { src, class: className }: Props = $props();
</script>

<img {src} alt="logo" class={cn('h-18 w-18', className)} />
