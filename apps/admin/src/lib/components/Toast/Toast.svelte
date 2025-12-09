<script lang="ts">
  import { CircleCheck, CircleX } from '@lucide/svelte';
  import { fly } from 'svelte/transition';
  import { useToastStore } from '$lib/stores';

  const toast = useToastStore();
</script>

{#if toast}
  <div class="fixed left-0 right-0 top-5 z-50 mx-auto w-full max-w-lg px-4">
    <div class="flex flex-col gap-2">
      {#each toast.toasts as t, i (i)}
        <div
          class="rounded-lg bg-white px-3 py-2 text-center shadow-lg"
          transition:fly={{ y: -100, duration: 300 }}
        >
          {#if t.type === 'message'}
            <div class="flex items-center justify-center gap-2">
              <CircleCheck class="h-4 w-4 text-emerald-500" />
              <p class="text-success">{t.message}</p>
            </div>
          {/if}
          {#if t.type === 'error'}
            <div class="flex items-center justify-center gap-2">
              <CircleX class="h-4 w-4 text-red-500" />
              <p class="text-red-500">{t.message}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
