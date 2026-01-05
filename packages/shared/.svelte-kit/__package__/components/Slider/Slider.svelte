<script lang="ts">
import { fade } from "svelte/transition";

type Props = {
	items: {
		title: string;
		description: string;
		src: string;
	}[];
};

let { items }: Props = $props();
let index = $state(0);

$effect(() => {
	const interval = setInterval(() => {
		index = (index + 1) % items.length;
	}, 10_000);

	return () => clearInterval(interval);
});
</script>

<div class="slider-wrapper">
	{#each [items[index]] as { src, title, description }, i (i)}
		<div class="absolute h-full w-full overflow-hidden">
			<img in:fade {src} alt={title} class="h-full w-full object-cover" />
		</div>
		<div class="absolute h-full w-full bg-linear-to-tr from-black/70 to-transparent"></div>
		<div class="absolute flex h-full w-full items-end px-16 pb-10">
			<div class="container">
				<div class="z-10 py-20">
					<div class="w-full max-w-[1000px]">
						<p class="text-5xl font-extrabold text-white">{title}</p>
						<hr />
						<p class="text-xl font-semibold text-slate-200">{description}</p>
					</div>
					<div class="flex flex-row justify-center gap-6 pt-5">
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each items as item, i (i)}
							<button
								class="h-1 w-3 rounded-full bg-slate-200 transition-colors duration-300 ease-in-out hover:bg-yellow-300"
								class:bg-yellow-500={index === i}
								onclick={() => (index = i)}
								aria-label="Zobrazit"
							>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
  .slider-wrapper {
    height: 600px;
    position: relative;
    overflow: hidden;
  }
  .slider-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
