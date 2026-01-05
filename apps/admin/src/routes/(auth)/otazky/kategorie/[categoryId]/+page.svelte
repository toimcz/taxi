<script lang="ts">
import { QuestionsCategoryCreateInput, QuestionsCategoryUpdateInput } from "@taxi/contracts";
import {
	Card,
	InputNumber,
	InputSwitch,
	InputText,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto, invalidateAll } from "$app/navigation";

const { data } = $props();
const schema = $derived(
	data.category ? QuestionsCategoryUpdateInput : QuestionsCategoryCreateInput,
);
const toast = useToastStore();

// svelte-ignore state_referenced_locally
const form = useForm(schema, {
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Kategorie otázek byla úspěšně uložena");
		await goto(`/otazky/kategorie`);
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
</script>

<WebPage title={data.title} description={data.description}>
  <div class="flex justify-center">
    <Card class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold">{data.title}</h1>
      <hr class="my-4" />
      <form
        class="flex flex-col gap-4"
        method="post"
        action={data.category ? `?/update` : "?/create"}
        use:enhance={form.submit}
      >
        <div>
          <InputText
            label="Název kategorie"
            name="name"
            id="name"
            value={data.category?.name || ""}
            error={form.issues?.name}
          />
        </div>
        <div>
          <InputText
            label="Popis kategorie"
            name="description"
            id="description"
            value={data.category?.description || ""}
            error={form.issues?.description}
          />
        </div>
        <div>
          <InputNumber
            label="Pořadí"
            name="order"
            id="order"
            value={data.category?.order || ""}
            error={form.issues?.order}
          />
        </div>
        <div>
          <InputSwitch
            label="Aktivní"
            name="status"
            id="status"
            checked={data.category?.status || false}
            error={form.issues?.status}
          />
        </div>
        <div>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={form.processing}
            >{form.processing ? "Ukládání..." : "Uložit"}</button
          >
        </div>
      </form>
    </Card>
  </div>
</WebPage>
