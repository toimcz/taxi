<script lang="ts">
import { PostCreateInput, PostUpdateInput } from "@taxi/contracts";
import {
	Card,
	Input,
	InputDate,
	InputEditor,
	InputPhoto,
	InputSwitch,
	InputText,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { format } from "date-fns";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { page } from "$app/state";

let { data } = $props();
let backUrl = $derived(`/clanky`);

const toast = useToastStore();

const title = $derived(data.post ? "Editace článku" : "Nový článek");
const description = $derived(data.post ? "Editace článku" : "Nový článek");

const formCreate = useForm(PostCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Článek byl úspěšně uložen");
		await goto(backUrl);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const formUpdate = useForm(PostUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Článek byl úspěšně uložen");
		await goto(backUrl);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const form = $derived(data.post ? formUpdate : formCreate);
const action = $derived(data.post ? "?/update" : "?/create");

$inspect(data.post);
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-3xl">
    <div class="mb-3 flex items-center justify-between gap-x-6">
      <h1 class="text-xl font-bold">{title}</h1>
      <a href={backUrl} class="btn btn-light btn-sm">Zpět</a>
    </div>
    <hr />
    {#key page.params}
      <form
        method="post"
        enctype="multipart/form-data"
        class="grid grid-cols-10 gap-4"
        use:enhance={form.submit}
        {action}
      >
        <div class="col-span-10">
          <InputText
            id="title"
            label="Titulek"
            name="title"
            value={data.post?.title || ""}
            error={form.issues?.title}
          />
        </div>
        <div class="col-span-10">
          <InputText
            id="description"
            label="Popis"
            name="description"
            value={data.post?.description || ""}
            error={form.issues?.description}
          />
        </div>

        <div class="col-span-10 xl:col-span-5">
          <Input
            id="categoryId"
            label="Kategorie"
            error={form.issues?.categoryId}
          >
            <select
              id="categoryId"
              name="categoryId"
              value={data.post?.categoryId || ""}
            >
              <option value="">Vyberte kategorii</option>
              {#each data.categories as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </select>
          </Input>
        </div>
        <div class="col-span-10 xl:col-span-5">
          <InputText
            id="tags"
            label="Tagy"
            name="tags"
            value={data.post ? data.post.tags.join(",") : ""}
            error={form.issues?.tags}
          />
        </div>
        <div class="col-span-10 xl:col-span-5">
          <InputDate
            id="publishAt"
            label="Zveřejnit od"
            name="publishAt"
            value={data.post ? format(data.post.publishAt, "yyyy-MM-dd") : ""}
            error={form.issues?.publishAt}
          />
        </div>
        <div class="col-span-10 xl:col-span-5">
          <InputDate
            id="expiresAt"
            label="Zveřejnit do"
            name="expiresAt"
            value={data.post && data.post.expiresAt
              ? format(data.post.expiresAt, "yyyy-MM-dd")
              : ""}
            error={form.issues?.expiresAt}
          />
        </div>
        <div class="col-span-10">
          <InputEditor
            id="content"
            label="Obsah"
            placeholder="Obsah"
            class="min-h-[300px]"
            name="content"
            content={data.post?.content || ""}
            error={form.issues?.content}
          />
        </div>
        <div class="col-span-10">
          <InputPhoto id="image" imgUrl={data.post?.photo} name="image" />
        </div>
        <div class="col-span-10">
          <InputSwitch
            id="public"
            label="Publikovat"
            name="public"
            checked={false}
          />
        </div>
        <div class="col-span-10">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={form.processing}
            >{form.processing ? "Ukládám..." : "Uložit"}</button
          >
        </div>
      </form>
    {/key}
  </Card>
</WebPage>
