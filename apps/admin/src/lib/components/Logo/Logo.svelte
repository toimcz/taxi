<script lang="ts">
import { cn } from "@taxi/shared";

type Props = {
	class?: string;
};

let { class: className }: Props = $props();
</script>

<img src="/images/logo.png" alt="logo" class={cn('h-18 w-18', className)} />
