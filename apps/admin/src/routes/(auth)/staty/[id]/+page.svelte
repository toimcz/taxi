<script lang="ts">
import { CountryUpdateInput } from "@taxi/contracts";
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
import { goto } from "$app/navigation";

let { data } = $props();

const toast = useToastStore();

const title = $derived(data.country ? "Upravit stát" : "Vytvořit stát");
const description = $derived(data.country ? "Upravit stát" : "Vytvořit stát");

const form = useForm(CountryUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Stát byl úspěšně uložen");
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
            name="name"
            value={data.country.name}
            disabled={true}
          />
        </div>
        <div>
          <InputNumber
            id="koeficient"
            label="Koeficient"
            name="koeficient"
            min={1}
            step={0.01}
            value={data.country.koeficient}
            error={form.issues?.koeficient}
          />
        </div>
        <InputSwitch
          id="from"
          label="Nakládka"
          name="from"
          checked={data.country.from}
          error={form.issues?.from}
        />
        <InputSwitch
          id="to"
          label="Vykládka"
          name="to"
          checked={data.country.to}
          error={form.issues?.to}
        />
        <InputSwitch
          id="in"
          label="Kabotáž"
          name="in"
          checked={data.country.in}
          error={form.issues?.in}
        />
        <InputSwitch
          id="status"
          label="Status"
          name="status"
          checked={data.country.status || true}
          error={form.issues?.status}
        />
        <div class="flex justify-between gap-x-2">
          <button
            type="submit"
            class="btn btn-primary"
            disabled={form.processing}
            >{form.processing ? "Ukládám" : "Uložit"}</button
          >
          <div>
            <a href="/staty" class="btn btn-light">Zpět</a>
          </div>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
