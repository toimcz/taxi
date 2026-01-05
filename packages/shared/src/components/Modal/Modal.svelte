<script lang="ts">
import { cn } from "@taxi/shared";
import type { Snippet } from "svelte";
import { clickOutside } from "../../actions/click-outside.js";

type Props = {
	show: boolean;
	class?: string;
	onClose?: () => void;
	children: Snippet;
};

let { children, show = $bindable(false), class: className = "", onClose }: Props = $props();

function close() {
	show = false;
	onClose?.();
}
</script>

{#if show}
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-200/75 transition-opacity" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          use:clickOutside
          onclickoutside={close}
          class={cn(
            'relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8',
            className,
          )}
        >
          <div class="p-3 sm:p-6 sm:pb-4">
            {@render children?.()}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
