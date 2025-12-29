<script lang="ts">
import { BaseUpdateInput } from "@taxi/contracts";
import { Card, InputNumber, InputSwitch } from "@taxi/ui";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { WebPage } from "$lib/components/index.js";
import { useForm } from "$lib/hooks/use-form.svelte.js";
import { useToastStore } from "$lib/stores/index.js";

let title = "Editace základny";
let description = "Editace základny";

let { data, params } = $props();

const toast = useToastStore();

const form = useForm(BaseUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Základna byla úspěšně uložena");
		await goto(`/zakladny/${params.id}`);
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-sm">
    <h1 class="text-xl font-bold">{title}</h1>
    <h2 class="text-lg font-medium">{data.base.city}</h2>
    <hr />

    <form method="post" use:enhance={form.submit} class="grid grid-cols-1 gap-4">
      <div>
        <InputNumber
          id="koeficient"
          label="Koeficient"
          name="koeficient"
          step={0.01}
          value={data.base.koeficient}
          error={form.issues?.koeficient}
        />
      </div>
      <div>
        <InputNumber
          id="strength"
          label="Síla v km"
          name="strength"
          value={data.base.strength}
          error={form.issues?.strength}
        />
      </div>
      {#if data.auth?.roles.some((role) => role.includes('DEV'))}
        <div>
          <InputSwitch
            id="status"
            label="Status"
            name="status"
            checked={data.base.status ?? false}
          />
        </div>
      {/if}
      <div class="flex justify-between gap-x-2">
        <button type="submit" class="btn btn-primary" disabled={form.processing}
          >{form.processing ? 'Ukládám' : 'Uložit'}</button
        >
        <div>
          <a href={`/zakladny/${params.id}`} class="btn btn-light">Zpět</a>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
