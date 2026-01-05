<script lang="ts">
import { DriverCreateInput, DriverUpdateInput } from "@taxi/contracts";
import {
	Card,
	InputEmail,
	InputPhone,
	InputSwitch,
	InputText,
	SubmitButton,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

let { data, params } = $props();

const title = $derived(data.driver ? "Editace řidiče" : "Nový řidič");
const description = $derived(data.driver ? `Detail řidiče` : "Nový řidič");

const toast = useToastStore();

const formCreate = useForm(DriverCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Řidič byl úspěšně uložen.");
		await goto(`/dopravci/${params.id}/ridici`);
	},
	onError: () => {
		toast.add("error", "Některé údaje nejsou vyplněny správně.");
	},
});

const formUpdate = useForm(DriverUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Řidič byl úspěšně uložen.");
		await goto(`/dopravci/${params.id}/detail`);
	},
	onError: () => {
		toast.add("error", "Některé údaje nejsou vyplněny správně.");
	},
});

const form = $derived(data.driver ? formUpdate : formCreate);
const action = $derived(data.driver ? "?/update" : "?/create");
</script>

<WebPage {title} {description}>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <Card>
        <h1 class="mb-3 text-xl font-bold">{title}</h1>
        <hr />
        <form method="post" {action} use:enhance={form.submit} class="flex flex-col gap-4">
          <div>
            <InputText
              id="firstName"
              name="firstName"
              label="Jméno"
              autocomplete="given-name"
              value={data.driver?.firstName || ""}
              error={form.issues?.firstName}
            />
          </div>
          <div>
            <InputText
              id="lastName"
              name="lastName"
              label="Příjmení"
              autocomplete="family-name"
              value={data.driver?.lastName || ""}
              error={form.issues?.lastName}
            />
          </div>
          <div>
            <InputEmail
              id="email"
              name="email"
              label="Email"
              autocomplete="email"
              value={data.driver?.email || ""}
              error={form.issues?.email}
            />
          </div>
          <div>
            <InputPhone
              id="phone"
              name="phone"
              label="Telefon"
              autocomplete="tel"
              value={data.driver?.phone || ""}
              error={form.issues?.phone}
            />
          </div>
          <div>
            <InputSwitch
              id="status"
              name="status"
              label="Aktivní"
              checked={data.driver ? data.driver.status : true}
              error={form.issues?.status}
            />
          </div>
          <div>
            <SubmitButton processing={form.processing}>
              {form.processing ? "Ukládám..." : "Uložit"}
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
