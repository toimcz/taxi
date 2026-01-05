<script lang="ts">
import { BaseUpdateInput } from "@taxi/contracts";
import { Card, InputNumber, InputSwitch, useForm, useToastStore, WebPage } from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { page } from "$app/state";

let title = "Editace základny";
let description = "Editace základny";

let { data } = $props();

const base = $derived(data.base);

const toast = useToastStore();

const form = useForm(BaseUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Základna byla úspěšně uložena");
		await goto(`/zakladny/${page.params.id}`);
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-sm">
    <h1 class="text-xl font-bold">{title}</h1>
    <h2 class="text-lg font-medium">{base.city}</h2>
    <hr />

    <form
      method="post"
      use:enhance={form.submit}
      class="grid grid-cols-1 gap-4"
    >
      <div>
        <InputNumber
          id="koeficient"
          label="Koeficient"
          name="koeficient"
          step={0.01}
          value={base.koeficient}
          error={form.issues?.koeficient}
        />
      </div>
      <div>
        <InputNumber
          id="strength"
          label="Síla v km"
          name="strength"
          value={base.strength}
          error={form.issues?.strength}
        />
      </div>
      {#if page.data.user?.roles.some((role) => role.includes("DEV"))}
        <div>
          <InputSwitch
            id="status"
            label="Status"
            name="status"
            checked={base.status}
          />
        </div>
      {/if}
      <div class="flex justify-between gap-x-2">
        <button type="submit" class="btn btn-primary" disabled={form.processing}
          >{form.processing ? "Ukládám" : "Uložit"}</button
        >
        <div>
          <a href={`/zakladny/${page.params.id}`} class="btn btn-light">Zpět</a>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
