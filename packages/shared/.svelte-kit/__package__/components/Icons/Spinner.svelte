<script lang="ts">
import { Compass } from "@lucide/svelte";

type Props = {
	size?: number;
};

let { size = 16 }: Props = $props();
</script>

<Compass class="animate-spin" {size} />
