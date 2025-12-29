<script lang="ts">
type Props = {
	id: string;
	name: string;
	full?: boolean;
	imgUrl?: string | null | undefined;
};

let { id, name, imgUrl, full = false }: Props = $props();
let photoInput = $state<HTMLInputElement | null>(null);

const onPhotoUpload = (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		const image = target.files[0];
		imgUrl = URL.createObjectURL(image);
	}
};

const removeImage = (e: MouseEvent) => {
	e.preventDefault();
	e.stopPropagation();
	imgUrl = null;
	if (photoInput) {
		photoInput.value = "";
	}
};
</script>

<label
  for={id}
  class="group relative border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-center min-h-[280px] w-full cursor-pointer overflow-hidden rounded-xl transition-opacity hover:opacity-80"
>
  {#if imgUrl}
    <div
      class="flex h-full w-full items-center justify-center rounded-xl"
      class:max-w-[500px]={!full}
    >
      <img src={imgUrl} alt="fotka" class="h-full w-full object-cover" />
    </div>

    <!-- Tlačítko na smazání -->
    <button
      type="button"
      onclick={removeImage}
      aria-label="Smazat obrázek"
      class="absolute right-2 top-2 rounded-full bg-white p-1 shadow transition hover:bg-red-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-slate-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  {:else}
    <div class="pointer-events-none flex flex-col items-center text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mb-2 h-10 w-10 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <p class="text-sm">Klikni nebo přetáhni soubor sem</p>
      <p class="text-xs text-gray-400">JPG nebo PNG</p>
    </div>
  {/if}

  <input
    bind:this={photoInput}
    {id}
    {name}
    type="file"
    accept="image/*"
    class="hidden"
    onchange={onPhotoUpload}
  />
</label>
