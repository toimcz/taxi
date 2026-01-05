<script lang="ts">
import { Role, UserCreateInput } from "@taxi/contracts";
import {
	Card,
	Input,
	InputEmail,
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

const title = "Nový zákazník";
const description = "Nový zákazník";

const toast = useToastStore();

const form = useForm(UserCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Zákazník byl úspěšně vytvořen");
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
            value=""
            name="firstName"
            error={form.issues?.firstName}
          />
          <InputText
            id="lastName"
            label="Příjmení"
            value=""
            name="lastName"
            error={form.issues?.lastName}
          />
          <InputEmail
            id="email"
            label="Email"
            value=""
            name="email"
            error={form.issues?.email}
          />
          <InputPhone
            id="phone"
            label="Telefon"
            value=""
            name="phone"
            error={form.issues?.phone}
          />
          <div class="col-span-2">
            <InputTextarea
              id="note"
              label="Poznámka"
              value=""
              name="note"
              error={form.issues?.note}
              rows={3}
            />
          </div>
          <div class="col-span-2">
            <Input id="role" label="Role" error={form.issues?.role}>
              <select name="role" class="form-control" value="">
                {#each Object.values(Role) as role (role)}
                  <option value={role}>{role}</option>
                {/each}
              </select>
            </Input>
          </div>
          <div class="col-span-2">
            <p>Fakturační údaje</p>
          </div>
          <InputText
            id="name"
            label="Název"
            value=""
            name="name"
            error={form.issues?.name}
          />
          <InputText
            id="company"
            label="Firma"
            value=""
            name="company"
            error={form.issues?.company}
          />
          <div class="col-span-2">
            <InputText
              id="street"
              label="Ulice"
              value=""
              name="street"
              error={form.issues?.street}
            />
          </div>
          <InputText
            id="zip"
            label="PSČ"
            value=""
            name="zip"
            error={form.issues?.zip}
          />
          <InputText
            id="city"
            label="Město"
            value=""
            name="city"
            error={form.issues?.city}
          />
          <div class="col-span-2">
            <InputText
              id="country"
              label="Stát"
              value=""
              name="country"
              error={form.issues?.country}
            />
          </div>

          <InputText
            id="ic"
            label="IČ"
            value=""
            name="ic"
            error={form.issues?.ic}
          />
          <InputText
            id="dic"
            label="DIČ"
            value=""
            name="dic"
            error={form.issues?.dic}
          />
          <div class="col-span-2 flex justify-between gap-x-2">
            <SubmitButton processing={form.processing}>Uložit</SubmitButton>
            <a href="/zakaznici" class="btn btn-light btn-sm">Zpět</a>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
