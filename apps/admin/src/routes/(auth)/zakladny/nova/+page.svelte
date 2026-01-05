<script lang="ts">
import { BaseCreateInput } from "@taxi/contracts";
import {
	Card,
	Input,
	InputNumber,
	InputSwitch,
	InputText,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

let title = "Nová základna";
let description = "Nová základna";

const { data } = $props();

const toast = useToastStore();

const form = useForm(BaseCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Základna byla úspěšně vytvořena");
		await goto("/zakladny");
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
$inspect(form.issues);
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-sm">
    <div class="mb-3 flex items-center justify-between gap-x-6">
      <h1 class="text-xl font-bold">{title}</h1>
    </div>
    <hr />
    <form
      method="post"
      use:enhance={form.submit}
      class="grid grid-cols-1 gap-4"
    >
      <div>
        <InputText
          id="city"
          label="Město"
          value=""
          name="city"
          error={form.issues?.city}
        />
      </div>
      <div>
        <Input id="countryId" label="Stát" error={form.issues?.countryId}>
          <select name="countryId" class="form-control" value="">
            {#each data.countries as country}
              <option value={country.id}>{country.name}</option>
            {/each}
          </select>
        </Input>
      </div>
      <div>
        <InputNumber
          id="koeficient"
          label="Koeficient"
          name="koeficient"
          step={0.01}
          value=""
          error={form.issues?.koeficient}
        />
      </div>
      <div>
        <InputNumber
          id="strength"
          label="Síla v km"
          name="strength"
          value=""
          error={form.issues?.strength}
        />
      </div>
      <div>
        <InputSwitch id="status" label="Status" name="status" checked={false} />
      </div>
      <div class="flex justify-between gap-x-2">
        <input type="hidden" name="id" value="" />
        <button type="submit" class="btn btn-primary" disabled={form.processing}
          >{form.processing ? "Ukládám" : "Uložit"}</button
        >
        <div>
          <a href="/zakladny" class="btn btn-light">Zpět</a>
        </div>
      </div>
    </form>
  </Card>
</WebPage>
