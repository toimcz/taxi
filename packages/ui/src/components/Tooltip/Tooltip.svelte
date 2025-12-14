<script lang="ts">
import * as Popper from "@popperjs/core";
import type { Snippet } from "svelte";

type Props = {
	content: string;
	children: Snippet;
	placement?: "top" | "bottom" | "left" | "right";
};

let show = $state(false);
let button = $state<HTMLButtonElement>();
let tooltip = $state<HTMLDivElement>();

const { content, children, placement = "bottom" }: Props = $props();
</script>

<button
  bind:this={button}
  type="button"
  class="relative z-20"
  onclick={() => {
    show = !show;
    if (show && button && tooltip) {
      Popper.createPopper(button, tooltip, {
        placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ],
      });
    }
  }}
>
  {@render children?.()}
</button>

<div
  bind:this={tooltip}
  class="block bg-white p-3 rounded-lg shadow-lg absolute z-50 text-sm w-max max-w-sm text-center text-red-500"
  class:hidden={!show}
>
  {content}
</div>
