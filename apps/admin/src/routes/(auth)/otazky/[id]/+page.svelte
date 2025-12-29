<script lang="ts">
import { QuestionCreateInput, QuestionUpdateInput } from "@taxi/contracts";
import { Card, Input, InputEditor, InputSwitch, InputText } from "@taxi/ui";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { WebPage } from "$lib/components/index.js";
import { useForm } from "$lib/hooks/use-form.svelte.js";
import { useToastStore } from "$lib/stores/toast.svelte.js";

const { data } = $props();
const toast = useToastStore();

let meta = $derived(
	data.question
		? {
				title: "Upravit otázku",
				description: "Upravit otázku",
			}
		: {
				title: "Nová otázka",
				description: "Vytvoření nové otázky",
			},
);

// svelte-ignore state_referenced_locally
const form = useForm(data.question ? QuestionUpdateInput : QuestionCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Otázka byla úspěšně uložena");
		await goto(`/otazky`);
	},
	onError: () => {
		toast.add("error", "Chyba ve formuláři");
	},
});
</script>

<WebPage title={meta.title} description={meta.description}>
  <div class="flex justify-center">
    <Card class="w-full">
      <h1 class="mb-2 text-2xl font-bold">{meta.title}</h1>
      <form
        class="flex flex-col gap-4"
        method="post"
        action={data.question ? `?/update` : '?/create'}
        use:enhance={form.submit}
      >
        <div>
          <InputText
            label="Otázka"
            name="question"
            id="question"
            value={data.question?.question || ''}
            error={form.issues?.question}
          />
        </div>
        <div>
          <Input label="Kategorie" id="category-id">
            <select name="categoryId" id="category-id" value={data.question?.categoryId || null}>
              {#if data.categories.length}
                <option value={null}>-- Vyberte kategorii --</option>
                {#each data.categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              {:else}
                <option value="">Ostatní</option>
              {/if}
            </select>
          </Input>
        </div>
        <div>
          <InputEditor
            id="answer"
            label="Odpověď"
            name="answer"
            placeholder="Odpověď"
            content={data.question?.answer || ''}
          />
        </div>
        <div>
          <InputSwitch
            label="Aktivní"
            name="status"
            id="status"
            checked={data.question?.status || true}
            error={form.issues?.status}
          />
        </div>
        <div>
          <button class="btn btn-primary" type="submit" disabled={form.processing}
            >{form.processing ? 'Ukládání...' : 'Uložit'}</button
          >
        </div>
      </form>
    </Card>
  </div>
</WebPage>
