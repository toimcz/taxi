<script lang="ts">
import { Role, UserUpdateInput } from "@taxi/contracts";
import {
	Card,
	InputEmail,
	InputMultiSelect,
	InputPhone,
	InputText,
	InputTextarea,
	SubmitButton,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const title = "Editace zákazníka";
const description = "Editace zákazníka";

let { data } = $props();

const toast = useToastStore();

const form = useForm(UserUpdateInput, {
	onSuccess: async () => {
		console.log("onSuccess");
		toast.add("message", "Zákazník byl úspěšně uložen");
		await goto("/zakaznici");
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <div class="flex justify-center">
    <div class="w-full max-w-xl">
      <Card>
        <h1 class="text-lg font-bold">{title}</h1>
        <hr />
        <form
          method="post"
          class="grid grid-cols-2 gap-4"
          use:enhance={form.submit}
        >
          <InputText
            id="firstName"
            label="Jméno"
            value={data.user.firstName}
            name="firstName"
            error={form.issues?.firstName}
          />
          <InputText
            id="lastName"
            label="Příjmení"
            value={data.user.lastName}
            name="lastName"
            error={form.issues?.lastName}
          />
          <InputEmail
            id="email"
            label="Email"
            value={data.user.email}
            name="email"
            error={form.issues?.email}
          />
          <InputPhone
            id="phone"
            label="Telefon"
            value={data.user.phone || ""}
            name="phone"
            error={form.issues?.phone}
          />
          <div class="col-span-2">
            <InputTextarea
              id="note"
              label="Poznámka"
              value={data.user.note}
              name="note"
              error={form.issues?.note}
              rows={3}
            />
          </div>
          <div class="col-span-2">
            <InputMultiSelect
              id="roles"
              label="Role"
              name="roles"
              options={Object.values(Role).map((role) => ({
                label: role,
                value: role,
              }))}
              value={data.user.roles}
              error={form.issues?.role}
            />
          </div>
          <div class="col-span-2">
            <p>Fakturační údaje</p>
          </div>
          <InputText
            id="name"
            label="Název"
            value={data.user.billingDetails.name || ""}
            name="name"
            error={form.issues?.name}
          />
          <InputText
            id="company"
            label="Firma"
            value={data.user.billingDetails.company || ""}
            name="company"
            error={form.issues?.company}
          />
          <div class="col-span-2">
            <InputText
              id="street"
              label="Ulice"
              value={data.user.billingDetails.street || ""}
              name="street"
              error={form.issues?.street}
            />
          </div>
          <InputText
            id="zip"
            label="PSČ"
            value={data.user.billingDetails.zip || ""}
            name="zip"
            error={form.issues?.zip}
          />
          <InputText
            id="city"
            label="Město"
            value={data.user.billingDetails.city || ""}
            name="city"
            error={form.issues?.city}
          />
          <div class="col-span-2">
            <InputText
              id="country"
              label="Stát"
              value={data.user.billingDetails.country || ""}
              name="country"
              error={form.issues?.country}
            />
          </div>

          <InputText
            id="ic"
            label="IČ"
            value={data.user.billingDetails.ic || ""}
            name="ic"
            error={form.issues?.ic}
          />
          <InputText
            id="dic"
            label="DIČ"
            value={data.user.billingDetails.dic || ""}
            name="dic"
            error={form.issues?.dic}
          />
          <div class="col-span-2 flex justify-between gap-x-2">
            <SubmitButton processing={form.processing}>Uložit</SubmitButton>
            <div>
              <a href="/zakaznici" class="btn btn-light">Zpět</a>
            </div>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
