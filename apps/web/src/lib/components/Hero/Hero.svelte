<script lang="ts">
import { Slider } from "@taxi/shared";
import { Search } from "$lib/components";

type Item = {
	title: string;
	description: string;
	src: string;
};

type Props = {
	items: Item[];
};

let { items }: Props = $props();
</script>

<div class="relative">
  <div class="hidden lg:block">
    <Slider {items} />
  </div>
  <div class="relative left-0 right-0 top-full px-4 lg:-mt-20">
    <Search />
  </div>
</div>
