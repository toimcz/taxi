<script lang="ts">
import { PartnerCreateInput, PartnerUpdateInput } from "@taxi/contracts";
import {
	Card,
	InputEmail,
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

const title = $derived(data.partner ? `Editace dopravce` : "Nový dopravce");
const description = $derived(data.partner ? `Editace dopravce` : "Nový dopravce");

const formCreate = useForm<typeof PartnerCreateInput, { id: string }>(PartnerCreateInput, {
	onSuccess: async ({ id }) => {
		toast.add("message", "Dopravce byl úspěšně uložen");
		await goto(`/dopravci/${id}/detail`);
	},
	onError: () => {
		toast.add("error", "Nepodařilo se uložit dopravce");
	},
});

const formUpdate = useForm<typeof PartnerUpdateInput, { id: string }>(PartnerUpdateInput, {
	onSuccess: async ({ id }) => {
		toast.add("message", "Dopravce byl úspěšně uložen");
		await goto(`/dopravci/${id}/detail`);
	},
	onError: () => {
		toast.add("error", "Nepodařilo se uložit dopravce");
	},
});

const form = $derived(data.partner ? formUpdate : formCreate);
const action = $derived(data.partner ? `?/update` : `?/create`);
</script>

<WebPage {title} {description}>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <Card>
        <h1 class="mb-4 text-xl font-bold">{title}</h1>
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
              name="name"
              id="name"
              value={data.partner?.name || ""}
              error={form.issues?.name}
            />
          </div>
          <div>
            <InputEmail
              label="Email"
              name="email"
              id="email"
              value={data.partner?.email || ""}
              error={form.issues?.email}
            />
          </div>
          <div>
            <InputText
              label="Telefon"
              name="phone"
              id="phone"
              value={data.partner?.phone || ""}
              error={form.issues?.phone}
            />
          </div>
          {#if data.partner}
            <div>
              <InputSwitch
                label="Status"
                name="status"
                id="status"
                checked={data.partner ? data.partner.status : true}
              />
            </div>
          {/if}
          <div>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={form.processing}
              >{form.processing ? "Ukládám..." : "Uložit"}</button
            >
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
