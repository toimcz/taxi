<script lang="ts">
import { X } from "@lucide/svelte";
import { clickOutside } from "../../../actions/click-outside.js";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	options: { label: string; value: string }[];
	value: string[];
	error?: string[] | undefined;
	setValue?: (value: string[]) => void;
};

let { id, label, name, options, value = $bindable([]), error, setValue }: Props = $props();
let show = $state(false);

$effect(() => {
	if (!show) return;
	if (typeof window === "undefined") return;

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			e.preventDefault();
			show = false;
		}
	};

	window.addEventListener("keydown", onKeyDown);
	return () => window.removeEventListener("keydown", onKeyDown);
});

function set(v: string) {
	if (value.includes(v)) {
		value = value.filter((item) => item !== v);
	} else {
		value = [...value, v];
	}
	setValue?.(value);
}
</script>

<Input {id} {label} {error}>
  <div use:clickOutside onclickoutside={() => (show = false)}>
    <input type="hidden" {id} {name} value={value.join(', ')} />
    <div
      class="flex flex-wrap gap-x-1 gap-y-2 pt-1"
      onclick={() => (show = true)}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show = true;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          show = false;
        }
      }}
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      aria-expanded={show}
    >
      {#each value as v}
        <button
          type="button"
          onclick={() => set(v)}
          class="bg-slate-200 py-0.5 px-3 rounded-md text-sm font-light text-slate-500 flex items-center justify-center gap-x-1"
        >
          <X size={11} class="text-slate-500 cursor-pointer" />
          {options.find((option) => option.value === v)?.label}
        </button>
      {/each}
    </div>
    {#if show}
      <div
        class="flex flex-wrap gap-x-1 gap-y-2 bg-white rounded-xl py-3 px-5 shadow-md absolute top-full left-0 w-full z-10"
      >
        {#each options.filter((option) => !value.includes(option.value)) as option}
          <button
            type="button"
            onclick={() => set(option.value)}
            class="bg-slate-100 py-0.5 px-3 rounded-md text-sm font-light text-slate-500"
          >
            {option.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</Input>
