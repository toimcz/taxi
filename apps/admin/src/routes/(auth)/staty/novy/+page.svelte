<script lang="ts">
import { CountryCreateInput } from "@taxi/contracts";
import { Card, InputNumber, InputSwitch, InputText } from "@taxi/ui";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { WebPage } from "$lib/components";
import { useForm } from "$lib/hooks/use-form.svelte.js";
import { useToastStore } from "$lib/stores";

const toast = useToastStore();

const title = "Vytvořit stát";
const description = "Vytvořit stát";

const form = useForm(CountryCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Stát byl úspěšně vytvořen");
		await goto("/staty");
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-sm">
    <h1 class="text-xl font-bold">{title}</h1>
    <hr />
    <form method="post" use:enhance={form.submit}>
      <div class="grid grid-cols-1 gap-4">
        <div>
          <InputText
            id="name"
            label="Stát"
            value=""
            name="name"
            disabled={false}
            error={form.issues?.name}
          />
        </div>
        <div>
          <InputNumber
            id="koeficient"
            label="Koeficient"
            name="koeficient"
            min={1}
            step={0.01}
            value={1}
            error={form.issues?.koeficient}
          />
        </div>
        <InputSwitch
          id="from"
          label="Nakládka"
          name="from"
          checked={true}
          error={form.issues?.from}
        />
        <InputSwitch id="to" label="Vykládka" name="to" checked={true} error={form.issues?.to} />
        <InputSwitch id="in" label="Kabotáž" name="in" checked={true} error={form.issues?.in} />
        <InputSwitch
          id="status"
          label="Status"
          name="status"
          checked={true}
          error={form.issues?.status}
        />
        <div class="flex justify-between gap-x-2">
          <button type="submit" class="btn btn-primary" disabled={form.processing}
            >{form.processing ? 'Ukládám' : 'Uložit'}</button
          >
          <div>
            <a href="/staty" class="btn btn-light">Zpět</a>
          </div>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
