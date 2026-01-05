<script lang="ts">
import { PageCreateInput, PageUpdateInput } from "@taxi/contracts";
import {
	Card,
	InputEditor,
	InputNumber,
	InputSwitch,
	InputText,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const toast = useToastStore();

const { data } = $props();

const formCreate = useForm(PageCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Stránka byla úspěšně uložena");
		await goto("/stranky");
	},
	onError: async () => {
		toast.add("error", "Něco se pokazilo");
	},
});

const formUpdate = useForm(PageUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Stránka byla úspěšně uložena");
		await goto("/stranky");
	},
	onError: async () => {
		toast.add("error", "Něco se pokazilo");
	},
});

let form = $derived(data.page ? formUpdate : formCreate);
let action = $derived(data.page ? "?/update" : "?/create");
</script>

<WebPage title={data.title} description={data.description}>
  <div class="flex justify-center">
    <Card class="w-full">
      <h1 class="text-xl font-bold">{data.title}</h1>
      <hr />
      <form
        method="post"
        {action}
        class="grid grid-cols-1 gap-4"
        use:enhance={form.submit}
      >
        <div>
          <InputText
            label="Název"
            name="title"
            id="title"
            value={data.page?.title || ""}
            error={form.issues?.title}
          />
        </div>
        <div>
          <InputText
            label="Popis"
            name="description"
            id="description"
            value={data.page?.description || ""}
            error={form.issues?.description}
          />
        </div>
        <div>
          <InputNumber
            label="Pořadí"
            name="position"
            id="position"
            value={data.page?.position || ""}
            error={form.issues?.position}
          />
        </div>
        <div>
          <InputEditor
            id="content"
            label="Obsah"
            name="content"
            content={data.page?.content || ""}
            error={form.issues?.content}
          />
        </div>
        <div>
          <InputSwitch
            label="Zobrazit v hlavní nabídce"
            name="top"
            id="top"
            checked={data.page?.top || false}
            error={form.issues?.top}
          />
        </div>
        <div>
          <InputSwitch
            label="Zobrazit ve footeru"
            name="bottom"
            id="bottom"
            checked={data.page?.bottom || false}
            error={form.issues?.bottom}
          />
        </div>
        <div>
          <InputSwitch
            label="Aktivní"
            name="status"
            id="status"
            checked={data.page?.status || false}
            error={form.issues?.status}
          />
        </div>
        <div>
          <button type="submit" class="btn btn-primary">Uložit</button>
        </div>
      </form>
    </Card>
  </div>
</WebPage>
