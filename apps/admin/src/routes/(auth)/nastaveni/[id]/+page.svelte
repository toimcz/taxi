<script>
import { SettingCreateInput, SettingUpdateInput } from "@taxi/contracts";
import { Card, InputSwitch, InputText, useForm, useToastStore, WebPage } from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

let { data } = $props();

const title = "Nastavení";
const description = "Správa nastavení";

const toast = useToastStore();

const formCreate = useForm(SettingCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Nastavení byla úspěšně uloženo");
		await goto(`/nastaveni`);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const formUpdate = useForm(SettingUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Nastavení byla úspěšně uloženo");
		await goto(`/nastaveni`);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});

const form = $derived(data.setting ? formUpdate : formCreate);
const action = $derived(data.setting ? "?/update" : "?/create");
</script>

<WebPage {title} {description}>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <Card>
        <h1 class="text-xl font-bold">Nastavení</h1>
        <hr />
        <form
          method="post"
          {action}
          class="flex flex-col gap-4"
          use:enhance={form.submit}
        >
          <InputText
            id="key"
            name="key"
            label="Název (malá písmena a odělovací tečka)"
            placeholder="např. app.name"
            value={data.setting?.key || ""}
            error={form.issues?.key}
          />
          <InputText
            id="value"
            name="value"
            label="Hodnota"
            value={data.setting?.value || ""}
            error={form.issues?.value}
          />
          {#if data.user?.roles.includes("dev")}
            <InputText
              id="devValue"
              name="devValue"
              label="Hodnota pro vývoj"
              value={data.setting?.devValue || ""}
              error={form.issues?.devValue}
            />
          {/if}
          <InputText
            id="description"
            name="description"
            label="Popis"
            value={data.setting?.description || ""}
            error={form.issues?.description}
          />
          {#if data.user?.roles.includes("dev")}
            <InputSwitch
              id="editable"
              name="editable"
              label="Upravitelné"
              checked={data.setting?.editable || false}
              error={form.issues?.editable}
            />
          {/if}
          <div class="flex justify-between gap-x-4">
            <button type="submit" class="btn btn-primary">Uložit</button>
            <a href="/nastaveni" class="btn btn-light">Zpět</a>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
