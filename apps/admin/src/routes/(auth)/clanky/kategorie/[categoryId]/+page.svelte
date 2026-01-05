<script lang="ts">
import { PostCategoryCreateInput } from "@taxi/contracts";
import { Card, InputSwitch, InputText, useForm, useToastStore, WebPage } from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const { data } = $props();
const toast = useToastStore();

const formCreate = useForm(PostCategoryCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Kategorie článků byla úspěšně uložena");
		await goto(`/clanky/kategorie`);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const formUpdate = useForm(PostCategoryCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Kategorie článků byla úspěšně uložena");
		await goto(`/clanky/kategorie`);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const form = $derived(data.category ? formUpdate : formCreate);
const action = $derived(data.category ? "?/update" : "?/create");
</script>

<WebPage title={data.title} description={data.description}>
  <div class="flex justify-center">
    <Card class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold">{data.title}</h1>
      <hr />
      <form
        class="flex flex-col gap-4"
        method="post"
        {action}
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
          <InputSwitch
            label="Aktivní"
            name="status"
            id="status"
            checked={data.category ? data.category.status : true}
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
