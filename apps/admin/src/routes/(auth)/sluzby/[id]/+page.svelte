<script lang="ts">
import { ServiceCreateInput } from "@taxi/contracts";
import {
	Card,
	InputEditor,
	InputNumber,
	InputPhoto,
	InputSwitch,
	InputText,
	sleep,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

let { data } = $props();

const title = $derived(data.service ? "Upravit službu" : "Nová služba");
const toast = useToastStore();

const form = useForm(ServiceCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Služba byla úspěšně uložena");
		await sleep(500);
		await goto("/sluzby");
	},
	onError: () => {
		toast.add("error", "Něco se pokazilo");
	},
});
</script>

<WebPage {title} description={title}>
  <div class="flex justify-center">
    <div class="w-full max-w-3xl">
      <Card>
        <h1 class="text-xl font-bold">{title}</h1>
        <hr />
        <form
          method="post"
          action={data.service ? `?/update` : "?/create"}
          enctype="multipart/form-data"
          class="grid grid-cols-1 gap-4"
          use:enhance={form.submit}
        >
          <div>
            <InputText
              name="title"
              label="Název"
              id="title"
              value={data.service?.title || ""}
              error={form.issues?.title}
            />
          </div>
          <div>
            <InputText
              name="description"
              label="Popis"
              id="description"
              value={data.service?.description || ""}
              error={form.issues?.description}
            />
          </div>

          <div>
            <InputEditor
              id="content"
              label="Obsah"
              name="content"
              content={data.service?.content || ""}
              error={form.issues?.content}
            />
          </div>
          <div>
            <InputPhoto
              name="image"
              id="image"
              imgUrl={data.service?.photo
                ? `/img/services/${data.service?.photo}`
                : ""}
              full
            />
          </div>
          <div>
            <InputNumber
              name="position"
              label="Pořadí"
              id="position"
              value={data.service?.position || ""}
              error={form.issues?.position}
            />
          </div>
          <div>
            <InputSwitch
              name="status"
              label="Publikovat"
              id="status"
              checked={data.service?.status || true}
            />
          </div>
          <div>
            <button type="submit" class="btn btn-primary">Uložit</button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
