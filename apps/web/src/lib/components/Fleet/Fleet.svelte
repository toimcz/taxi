<script lang="ts">
const fleet = [
	{
		name: "MB E-Class",
		src: "/images/fleet/eclass.jpg",
	},
	{
		name: "MB V-Class",
		src: "/images/fleet/vclass.jpg",
	},
	{
		name: "MB Sprinter 8 osob",
		src: "/images/fleet/sprinter8.jpg",
	},
	{
		name: "MB Sprinter 20 osob",
		src: "/images/fleet/sprinter20.jpg",
	},
];
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
	{#each fleet as item (item.name)}
		<div class="relative overflow-hidden rounded-lg">
			<img src={item.src} alt={item.name} class="h-full w-full object-cover" />
			<div class="text-shadow absolute bottom-0 left-0 right-0 p-4 text-white">
				<h3 class="text-2xl font-bold">{item.name}</h3>
			</div>
		</div>
	{/each}
</div>

<style>
  .text-shadow {
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
</style>
