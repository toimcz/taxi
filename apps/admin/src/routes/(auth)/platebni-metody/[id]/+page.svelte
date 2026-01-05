<script lang="ts">
import { PaymentMethodCreateInput } from "@taxi/contracts";
import {
	Card,
	Input,
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

const toast = useToastStore();

const form = useForm(PaymentMethodCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Platební metoda byla úspěšně uložena");
		await sleep(500);
		await goto("/platebni-metody");
	},
	onError: () => {
		toast.add("error", "Něco se pokazilo");
	},
});
</script>

<WebPage title={data.title} description={data.description}>
  <Card class="mx-auto w-full max-w-sm">
    <h1 class="text-xl font-bold">{data.title}</h1>
    <hr />
    <form
      method="post"
      action={data.paymentMethod ? "?/update" : "?/create"}
      use:enhance={form.submit}
    >
      <div class="grid grid-cols-1 gap-4">
        <div>
          <InputText
            id="name"
            label="Název"
            value={data.paymentMethod?.name || ""}
            name="name"
            error={form.issues?.name}
          />
        </div>
        <div>
          <InputText
            id="admin-name"
            label="Název v adminu"
            value={data.paymentMethod?.adminName || ""}
            name="adminName"
            error={form.issues?.adminName}
          />
        </div>
        <div>
          <InputText
            id="description"
            label="Popis"
            value={data.paymentMethod?.description || ""}
            name="description"
            error={form.issues?.description}
          />
        </div>
        <div>
          <Input id="provider" label="Provider" error={form.issues?.provider}>
            <select
              name="provider"
              id="provider"
              value={data.paymentMethod?.provider || ""}
            >
              <option value="">Vyberte providera</option>
              {#each data.providers as provider}
                <option value={provider}>{provider}</option>
              {/each}
            </select>
          </Input>
        </div>
        <InputSwitch
          id="public"
          label="Veřejná"
          name="public"
          checked={data.paymentMethod?.public || false}
          error={form.issues?.public}
        />
        <InputSwitch
          id="status"
          label="Status"
          name="status"
          checked={data.paymentMethod?.status || true}
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
            <a href="/platebni-metody" class="btn btn-light">Zpět</a>
          </div>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
