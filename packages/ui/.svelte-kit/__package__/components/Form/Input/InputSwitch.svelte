<script lang="ts">
type Props = {
	id: string;
	label: string;
	name: string;
	checked: boolean;
	error?: string[] | undefined;
	setValue?: (value: boolean) => void;
};

let {
	id,
	label,
	name,
	checked = $bindable(false),
	error,
	setValue,
}: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLInputElement).checked;
	error = undefined;
	setValue?.(v);
}
</script>

<label for="hid-{id}" class="flex cursor-pointer items-center rounded-xl bg-transparent p-2">
	<div class="relative">
		<input id="hid-{id}" bind:checked onchange={setInputValue} type="checkbox" class="hidden" />
		<input {id} type="text" {name} value={checked} class="hidden" />

		<div class="toggle__line h-3 w-7 rounded-full bg-red-400 shadow-inner"></div>

		<div class="toggle__dot absolute h-5 w-5 rounded-full bg-red-600 shadow"></div>
	</div>

	<div class="ml-5 text-sm font-semibold uppercase">{label}</div>
</label>
{#if error}
	{#each error as err, i (i)}
		<p class="text-sm italic text-red-600 dark:text-red-300">{err}</p>
	{/each}
{/if}

<style>
	.toggle__dot {
		top: -0.25rem;
		left: -0.25rem;
		transition: all 0.3s ease-in-out;
	}
	.toggle__line {
		transition: all 0.3s ease-in-out;
	}
	input:checked ~ .toggle__dot {
		transform: translateX(100%);
		background-color: #48bb78 !important;
	}
	input:checked ~ .toggle__line {
		background-color: #abeec7 !important;
	}
</style>
